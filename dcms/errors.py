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


class MercuryError(Exception):
    """
    """


class IllegalArgumentError(MercuryError):
    """非法的参数
    """


class MapApiError(MercuryError):
    """地图API调用异常
    """


class DatabaseError(MercuryError):
    """数据库错误
    """


class WorkflowError(MercuryError):
    """工作流异常
    """

    def __init__(self, code, msg):
        self.code = code
        self.msg = msg


class GatewayError(MercuryError):
    """
    """