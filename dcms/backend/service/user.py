# -*- coding: utf-8

# Copyright (c) 2016 Smallpay Inc
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
# implied.
# See the License for the specific language governing permissions and
# limitations under the License.
from dcms.backend.constants import USER_STATUS
from dcms.backend.gateway import UserCenter
from dcms.backend.models import User
from dcms.backend.activiti import User as ActivitiUser
from dcms.backend.service import DatabaseService, transactional
from dcms.backend.service.session import SessionService
from dcms.errors import AuthError


class UserService(DatabaseService):

    @transactional
    def login(self, username, password):
        uc = UserCenter()
        gw_resp = uc.login(username, password)
        if not gw_resp.success():
            raise AuthError('用户中心认证异常：{}'.format(gw_resp.return_message))

        sessionid = gw_resp.data.get('sessionid')
        usercode = gw_resp.data.get('usercode')
        db_user = User.query.filter(User.usercode == gw_resp.data.get('usercode')).first()
        if not db_user:
            db_user = User()
            db_user.usercode = usercode
            db_user.user_type = 1
            db_user.status = 1

            userinfo = uc.get_user_info(sessionid)
            if userinfo.success():
                db_user.name = userinfo.data.get('username')
                db_user.phone = userinfo.data.get('phone')
            else:
                db_user.name = username
                db_user.phone = username

            self.insert(db_user)

            # 向工作流同步用户信息
            self.sync_user_to_workflow(db_user)

        SessionService().put(sessionid, usercode, gw_resp.data.get('sessionid_expire'))

        return sessionid

    def register(self, username, password):
        uc = UserCenter()
        gw_resp = uc.register(username, password)
        if gw_resp.success():
            return gw_resp.data.get('usercode')
        return None

    def get_user(self, user_id):
        return User.query.filter(User.id == user_id).first()

    def get_user_by_code(self, usercode):
        return User.query.filter(User.usercode == usercode).first()

    def sync_user_to_workflow(self, user):
        activiti_user = ActivitiUser()
        au = activiti_user.get(user.usercode)
        if not au:
            activiti_user.create(user.usercode, user.name, None, None, None)
        elif user.status != USER_STATUS.ENABLE:
            activiti_user.delete(user.usercode)
        else:
            activiti_user.update(user.usercode, user.name, None, None, None)


