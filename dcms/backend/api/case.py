# coding: utf-8
#
# Copyright 2016 Smallpay Inc
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.
from flask import Blueprint
from flask_restful import Api
from flask_restful.reqparse import Argument

from dcms.backend.api import ApiResource
from dcms.backend.service.case import CaseService, CategoryService
from dcms.backend.models import Case, Category
from dcms.backend.generator import CodeGenerator

bp = Blueprint('restapi_case', __name__)
api = Api(bp)


@api.resource('/cases')
class CaseListResource(ApiResource):

    def get(self):
        return Case.query.all()

    def post(self):
        case = self.parse_body_to_model(Case)
        return CaseService().register_case(case)


@api.resource('/cases/codes')
class CaseCodeListResource(ApiResource):

    def post(self):
        code = CodeGenerator.gen_case_code()
        return dict(code=code)


@api.resource('/cases/<int:case_id>')
class CaseResource(ApiResource):

    def get(self, case_id):
        return Case.query.filter(Case.id == case_id).first()


@api.resource('/cases/sources')
class CaseSourceListResource(ApiResource):

    def get(self):
        return [
            {'id': 1, 'name': '门户网站'},
            {'id': 2, 'name': '热线电话'},
            {'id': 3, 'name': '监督员'},
            {'id': 4, 'name': '新闻媒体'},
            {'id': 5, 'name': '领导上报'},
            {'id': 6, 'name': '市民APP'}
        ]


@api.resource('/cases/categories')
class CategoryListResource(ApiResource):

    _query_arguments = [
        Argument('category_type', type=int),
        Argument('parent_code'),
    ]

    def get(self):
        category_type = self.get_argument('category_type')
        parent_code = self.get_argument('parent_code')

        return CategoryService().get_categories(parent_code, category_type)
