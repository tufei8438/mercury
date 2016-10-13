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


class WorkflowApi(object):

    _workflow_url_prefix = 'http://localhost:8088'

    def request(self, method, path, **kwargs):
        r = requests.request(method, self.url(path), **kwargs)
        return r.json()

    @classmethod
    def url(cls, path):
        return "{}{}".format(cls._workflow_url_prefix, path)

    @classmethod
    def camel2underscope(cls, name):
        replace_chars = []
        for char in name:
            if char.isupper():
                replace_chars.append('_' + char.lower())
            else:
                replace_chars.append(char)
        return ''.join(replace_chars)


class ProcessInstance(WorkflowApi):

    def start(self, process_definition_key, business_key=None, tenant_id=None, variables=None):
        """Start a process instance by processDefinitionId
        """
        payload = {
            "processDefinitionKey": process_definition_key,
            "businessKey": business_key,
            "tenantId": tenant_id,
            "variables": variables
        }
        return self.request('POST', '/runtime/process-instances', json=payload)


class Task(WorkflowApi):
    """

    """
