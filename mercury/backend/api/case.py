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
from mercury.backend.api import ApiResource
from mercury.backend.models import Case

bp = Blueprint('restapi_case', __name__)
api = Api(bp)


@api.resource('/cases')
class CaseListResource(ApiResource):

    def get(self):
        return Case.query.all()

    def post(self):



@api.resource('/cases/<int:case_id>')
class CaseResource(ApiResource):

    def get(self, case_id):
        return Case.query.filter(Case.id == case_id).first()
