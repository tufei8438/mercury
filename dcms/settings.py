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
import dcms.codec


DEBUG = True

SQLALCHEMY_DATABASE_URI = 'mysql://root:@localhost/cm?charset=utf8'

SQLALCHEMY_TRACK_MODIFICATIONS = True

RESTFUL_JSON = {
    'cls': dcms.codec.JsonEncoder
}

CACHE_TYPE = 'simple'

CACHE_DEFAULT_TIMEOUT = 300

CACHE_KEY_PREFIX = 'CACHE_MERCURY'

CACHE_REDIS_HOST = '127.0.0.1'

CACHE_REDIS_PORT = 6379


WORKFLOW_API_URL = 'http://localhost:8088'
