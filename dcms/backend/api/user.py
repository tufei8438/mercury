# -*- coding: utf-8

# Copyright (c) 2016 Smallpay
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
from flask import Blueprint
from flask import request
from flask_restful import Api, abort
from flask import Response

from dcms.backend.api import ApiResource
from dcms.backend.models import User
from dcms.backend.service.permission import PermissionService
from dcms.backend.service.user import UserService

bp = Blueprint('restapi_user', __name__)
api = Api(bp)


@api.resource('/user/login')
class LoginResource(ApiResource):

    _auth_required = False

    def post(self):
        login_data = request.get_json()
        username = login_data.get('username')
        password = login_data.get('password')
        sessionid = UserService().login(username, password)
        resp = Response(sessionid)
        resp.set_cookie('sessionid', sessionid)
        return resp


@api.resource('/user/info')
class UserResource(ApiResource):

    def get(self):
        return UserService().get_user_by_code(self.get_current_user())

    def put(self):
        user = self.parse_body_to_model(User)
        if user.usercode != self.get_current_user():
            abort(400, message='数据错误，用户只能修改自己的数据')
        return UserService().save(user, User)


@api.resource('/user/permissions')
class UserPermissionListResource(ApiResource):

    _auth_required = False

    def get(self):
        return PermissionService().get_user_roles('101710')


@api.resource('/permissions')
class PermissionListResource(ApiResource):

    def get(self):
        return PermissionService().get_permissions()


@api.resource('/roles')
class RoleListResource(ApiResource):

    def get(self):
        return PermissionService().get_roles()
