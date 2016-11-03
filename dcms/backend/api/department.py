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
from flask import Blueprint
from flask_restful import Api
from flask_restful.reqparse import Argument

from dcms.backend.api import ApiResource
from dcms.backend.service.department import DepartmentService

bp = Blueprint('restapi_department', __name__)
api = Api(bp)


@api.resource('/departments')
class DepartmentListResource(ApiResource):

    def get(self):
        return DepartmentService().get_departments()
