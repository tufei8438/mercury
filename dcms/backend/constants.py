# -*- coding: utf-8

# Copyright (c) 2016 Smallpay
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
from collections import namedtuple


CASE_STATUS = namedtuple('CASE_STATUS', 'CREATED CANCELLED COMPLETED')
CASE_STATUS.CREATED = 1
CASE_STATUS.CANCELLED = 2
CASE_STATUS.COMPLETED = 3

USER_STATUS = namedtuple('USER_STATUS', 'ENABLE DISABLE')
USER_STATUS.ENABLE = 1
USER_STATUS.DISABLE = 0

DEPT_STATUS = namedtuple('DEPT_STATUS', 'ENABLE DISABLE')
DEPT_STATUS.ENABLE = 1
DEPT_STATUS.DISABLE = 0

