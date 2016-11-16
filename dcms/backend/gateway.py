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
import hashlib
import urllib
import json
import uuid
import time

import requests
import requests.exceptions

from dcms.errors import GatewayError
from dcms.log import api_log


def hmac_sha1(key, raw):
    from hashlib import sha1
    import hmac
    import binascii

    # If you dont have a token yet, the key should be only "CONSUMER_SECRET&"
    # The Base String as specified here:
    hashed = hmac.new(key, raw, sha1)

    # The signature
    return binascii.b2a_base64(hashed.digest())[:-1]


def part_request_params(params, sort=False, url_encoding=True):
    """把请求要素按照“参数=参数值”的模式用“&”字符拼接成字符串
    @param params: 请求的参数字典
    @param sort: 是否需要根据key值作升序排列
    @param url_encoding: 是否需要URL编码
    @return 拼接成的字符串
    """
    if sort:
        param_items = sorted(params.iteritems(), key=lambda d: d[0])
    else:
        param_items = params.items()

    if url_encoding:
        return urllib.urlencode(param_items)
    else:
        results = []
        for item in param_items:
            results.append("%s=%s" % (item[0], item[1]))
        return '&'.join(results)


def sign(url, params, secret):
    sign_base_data = urllib.quote(url, safe="") + urllib.quote(part_request_params(params, sort=True))
    return hmac_sha1(secret, sign_base_data)


class GatewayResponse(object):

    def __init__(self, json_data):
        self._dict = json.loads(json_data)
        self.return_code = self._dict.get('return_code')
        self.return_message = self._dict.get('return_message')
        self.data = self._dict.get('data')

    def success(self):
        return self.return_code == 0 or self.return_code == '0'

    def __str__(self):
        return "return_code: %d\nreturn_message: %s\ndata: %s" % (self.return_code, self.return_message, self.data)


class GatewayClient(object):

    API_URL = 'http://182.48.115.36:8080/platform/api'
    APPKEY = "610152"
    CHANNEL = "10004"
    APPSECRET = "VgSKjru15iJfNwps6LFl4tZHzna7heBR"

    def __init__(self, api_url=None, appkey=None, channel=None, app_secret=None):
        self.api_url = api_url or self.API_URL
        self.appkey = appkey or self.APPKEY
        self.channel = channel or self.CHANNEL
        self.app_secret = app_secret or self.APPSECRET

    def submit(self, method, api_version=1, params=None):
        self._put_public_params(method, api_version, params)
        sign_data = sign(self.api_url, params, self.app_secret)
        params['sign'] = sign_data
        resp_body = self._request(self.api_url, params)
        api_response = GatewayResponse(resp_body)
        return api_response

    def _put_public_params(self, method, api_version, params):
        params['appkey'] = self.appkey
        params['channel_id'] = self.channel
        params['deviceid'] = 'deviceid'
        params['imei'] = 'imei'
        params['imsi'] = 'imsi'
        params['method'] = method
        params['api_version'] = api_version
        params['nonce'] = str(uuid.uuid1())
        params['timestamp'] = int(time.time())
        params['verson_code'] = 1

    def _request(self, url, parameters):
        try:
            api_log.debug('[GATEWAY REQ] parameters: {}'.format(parameters))
            r = requests.post(url, data=parameters)
            api_log.debug('[GATEWAY RES] response: {}'.format(r.text))
            if r.status_code == 200:
                return r.text
            else:
                raise GatewayError('请求网关服务：{}HTTP服务状态码返回：{}'.format(url, r.status_code))
        except requests.exceptions.RequestException as e:
            raise GatewayError('请求网关服务：{}异常：{}'.format(url, e.message))


class UserCenter(GatewayClient):

    def login(self, username, password, auth_type='001'):
        parameters = {
            'ua': "mercury.dcms",
            'username': username,
            'password': self._encrypt_password(password),
            'auth_type': auth_type,
            'user_type': 1
        }
        return self.submit('ih.user.auth.login', params=parameters)

    def register(self, username, password):
        parameters = {
            'ua': "mercury.dcms",
            'username': username,
            'password': self._encrypt_password(password),
            'type': 1
        }
        return self.submit('ih.user.auth.register', params=parameters)

    def get_user_info(self, sessionid):
        parameters = dict(sessionid=sessionid)
        return self.submit('ih.user.auth.getProfile', params=parameters)

    def _encrypt_password(self, password):
        return hashlib.sha1(password).hexdigest().upper()
