# coding: utf-8

# Copyright 2016 Smallpay Inc
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
from dcms.backend.service import DatabaseService
from dcms.backend.models import Department, Region


class DepartmentService(DatabaseService):

    def get_departments(self):
        q = Department.query
        return q.all()

    def get_department(self, department_id):
        q = self.db_session.query(Department, Region).join(Region, Region.id == Department.region_id)
        department, region = q.filter(Department.id == department_id).first()
        if department and region:
            department.region_name = region.name
        return department

    def save_department(self, department):
        return self.save(department, Department)

    def get_department_districts(self):
        """获取部门地区列表
        """
        return Region.query.filter(Region.level == 4).all()

    def get_region(self, region_id):
        """根据地区ID获取地区实体
        """
        return Region.query.filter(Region.id == region_id).first()

