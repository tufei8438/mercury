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
from dcms.backend import cache
from dcms.backend.service import DatabaseService
from dcms.backend.models import DepartmentUser, RolePermission, RoleUser, Role, Department, Permission


class PermissionService(DatabaseService):

    def get_user_roles(self, usercode):
        return self.db_session.query(Role)\
            .join(RoleUser, RoleUser.role_id == Role.id)\
            .filter(RoleUser.usercode == usercode).all()

    def get_permissions(self):
        return Permission.query.all()

    def get_roles(self):
        return Role.query.all()

    @cache.memoize()
    def get_role_permissons(self, role_id):
        q = self.db_session.query(Permission)\
            .join(RolePermission, RolePermission.permission_id == Permission.id)\
            .filter(RolePermission.role_id == role_id)
        return q.all()

    def get_user_permissions(self, user_id):
        permissions = []
        roles = self.get_user_roles(user_id)
        for role in roles:
            permissions += self.get_role_permissons(role.id)
        return permissions
