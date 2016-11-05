# -*- coding: utf-8

# Copyright (c) 2016 tufei
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
from dcms.backend import cache, db
from dcms.backend.generator import CodeGenerator
from dcms.backend.models import Case, Category
from dcms.backend.service import DatabaseService, transactional
from dcms.errors import IllegalArgumentError


class CategoryService(object):

    @cache.memoize()
    def get_categories(self, parent_code, category_type):
        q = Category.query
        if category_type is not None:
            q = q.filter(Category.type == category_type)
        q = q.filter(Category.parent_code == parent_code)
        return q.all()

    @cache.memoize()
    def get_category(self, category_type, category_code):
        return Category.query.filter(Category.type == category_type).\
            filter(Category.longcode == category_code).first()


class CaseService(DatabaseService):

    @transactional
    def register_case(self, case):
        """案件登记
        """
        if not isinstance(case, Case):
            raise IllegalArgumentError("无效的case参数类型")

        if case.code is None:
            case.code = CodeGenerator.gen_case_code()

        if case.parent_category_code and not case.parent_category_name:
            parent_category = CategoryService().get_category(
                case.category_type, case.parent_category_code)
            if parent_category:
                case.parent_category_name = parent_category.name

        if case.category_code and not case.category_name:
            category = CategoryService().get_category(
                case.category_type, case.category_code)
            if category:
                case.category_name = category.name

        if case.begin_time is None:
            now = datetime.datetime.now()
            case.begin_time = now
            case.expect_end_time = now + datetime.timedelta(minutes=30)

        self.insert(case)
        return case
