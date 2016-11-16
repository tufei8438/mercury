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
import datetime
from dcms.backend.models import Session, User
from dcms.backend.service import DatabaseService
from dcms.util import Configurable


class SessionService(Configurable):

    @classmethod
    def configurable_base(cls):
        return SessionService

    @classmethod
    def configurable_default(cls):
        return DatabaseSessionService

    def put(self, sessionid, usercode, expire):
        return self._put_impl(sessionid, usercode, expire)

    def get(self, sessionid):
        return self._get_impl(sessionid)

    def _put_impl(self, sessionid, usercode, expire):
        raise NotImplementedError()

    def _get_impl(self, sessionid):
        raise NotImplementedError()


class DatabaseSessionService(SessionService, DatabaseService):

    def _put_impl(self, sessionid, usercode, expire):
        db_session = Session()
        db_session.id = sessionid
        db_session.usercode = usercode
        if not expire:
            expire = 1200
        db_session.expire_at = datetime.datetime.now() + datetime.timedelta(seconds=int(expire))

        self.insert(db_session)
        self.commit()

    def _get_impl(self, sessionid):
        db_session = Session.query.filter(Session.id == sessionid).first()
        if not db_session:
            return None
        if db_session.expire_at < datetime.datetime.now():
            self.delete(db_session)
            self.commit()
            return None
        else:
            return db_session.usercode
