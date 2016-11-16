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

from dcms.errors import WorkflowError
from dcms.log import api_log


class WorkflowApi(object):

    _workflow_url_prefix = 'http://localhost:8088'
    _auth_basic_user = 'tufei'
    _auth_basic_pwd = 'tufei'

    def request(self, method, path, **kwargs):
        auth = (self._auth_basic_user, self._auth_basic_pwd)
        api_log.debug("[Activiti API REQ] method: {} url: {}".format(method, self.url(path)))
        r = requests.request(method, self.url(path), auth=auth, **kwargs)
        r_body = r.json()
        api_log.debug("[Activiti API RES] status: {} body: {}".format(r.status_code, r_body))
        if r.status_code in [200, 201, 204]:
            return r_body
        else:
            raise WorkflowError(r.status_code, r_body.get('errorMessage'))

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

    def __init__(self, task_id):
        self.task_id = task_id

    def get_form_data(self):
        """获取Task的表单
        """
        params = {
            'taskId': self.task_id
        }
        r_body = self.request('GET', '/form/form-data', params=params)
        return r_body.get('formProperties')

    def submit_form_data(self, properties):
        payload = {
            'taskId': self.task_id,
            'properties': properties,
        }
        return self.request('POST', '/form/form-data', json=payload)

    def complete(self, variables=None):
        """完成任务
        """
        payload = dict(action='complete')
        if variables:
            payload['variables'] = variables
        return self.request('POST', '/runtime/tasks/{}'.format(self.task_id), json=payload)

    def claim(self, assignee=None):
        """认领任务
        """
        payload = dict(action='claim')
        if assignee:
            payload['assignee'] = assignee
        return self.request('POST', '/runtime/tasks/{}'.format(self.task_id), json=payload)

    def delegate(self, assignee):
        """委派，代理任务
        """
        payload = dict(action='delegate', assignee=assignee)
        return self.request('POST', '/runtime/tasks/{}'.format(self.task_id), json=payload)


class User(WorkflowApi):

    def update(self, user_id, first_name, last_name, email, password):
        payload = {
            'firstName': first_name,
            'lastName': last_name,
            'email': email,
            'password': password,
        }
        return self.request('PUT', '/identity/users/{}'.format(user_id), json=payload)

    def create(self, user_id, first_name, last_name, email, password):
        payload = {
            'id': user_id,
            'firstName': first_name,
            'lastName': last_name,
            'email': email,
            'password': password,
        }
        return self.request('POST', '/identity/users', json=payload)

    def delete(self, user_id):
        return self.request('DELETE', '/identity/users/{}'.format(user_id))

    def get(self, user_id):
        try:
            return self.request('GET', '/identity/users/{}'.format(user_id))
        except WorkflowError as e:
            if e.code == 404:
                return None
            else:
                raise


class Group(WorkflowApi):

    def create(self, group_id, name):
        payload = {
            'id': group_id,
            'name': name,
            'type': 'assignment',
        }
        return self.request('POST', '/identity/groups', json=payload)

    def update(self, group_id, name):
        payload = dict(name=name)
        return self.request('POST', '/identity/groups/{}'.format(group_id), json=payload)

    def delete(self, group_id):
        return self.request('DELETE', '/identity/groups/{}'.format(group_id))

    def get(self, group_id):
        try:
            return self.request('GET', '/identity/groups/{}'.format(group_id))
        except WorkflowError as e:
            if e.code == 404:
                return None
            else:
                raise

    def add_member(self, group_id, user_id):
        payload = {
            'userId': user_id,
        }
        return self.request('POST', '/identity/groups/{}/members'.format(group_id), json=payload)

    def delete_member(self, group_id, user_id):
        return self.request('DELETE', '/identity/groups/{}/members/{}'.format(group_id, user_id))

