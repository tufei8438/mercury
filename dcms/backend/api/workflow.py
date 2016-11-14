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
import requests
from flask import Blueprint
from flask import make_response
from flask import request
from flask_restful import Api
from werkzeug.datastructures import EnvironHeaders

from dcms.backend.api import ApiResource

bp = Blueprint('restapi_workflow', __name__)
api = Api(bp)


@api.resource('/workflow/<path:api_path>')
class WorkflowResource(ApiResource):

    methods = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD']

    WORKFLOW_API_URL = 'http://localhost:8088'
    AUTH_BASIC_USER = 'tufei'
    AUTH_BASIC_PWD = 'tufei'

    def dispatch_request(self, *args, **kwargs):
        headers = self.headers_to_dict(request.headers)
        params = request.args.to_dict()
        url = "{}/{}".format(self.WORKFLOW_API_URL, kwargs.get('api_path'))
        method = request.method
        auth = (self.AUTH_BASIC_USER, self.AUTH_BASIC_PWD)
        r = requests.request(method, url, headers=headers, params=params, data=request.get_data(), auth=auth)
        response = make_response(r.content, r.status_code)
        if 'content-type' in r.headers:
            response.headers['content-type'] = r.headers['content-type']
        if 'content-length' in r.headers:
            response.headers['content-length'] = r.headers['content-length']
        if 'content-disposition' in r.headers:
            response.headers['content-disposition'] = r.headers['content-disposition']
        return response

    def headers_to_dict(self, headers):
        assert isinstance(headers, EnvironHeaders)
        items = headers.items()
        _dict = dict()
        for item in items:
            if len(item[1]) > 0:
                _dict[item[0]] = item[1]
        return _dict

