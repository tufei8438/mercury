# -*- coding: utf-8

# Copyright (c) 2016 Smallpay Inc
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
import math
import requests

from dcms.errors import MapApiError


class MapApi(object):

    MAP_SERVICE_URL = 'http://182.48.115.38:28088/dataService/mapService'

    def get_map_grid(self, x, y):
        x, y = self.mc_to_ll(float(x), float(y))
        parameters = {
            'method': 'grid',
            'x': x,
            'y': y,
        }
        r = requests.get(self.MAP_SERVICE_URL, params=parameters)
        if r.status_code != 200:
            raise MapApiError("调用地图API HTTP返回状态码：{}".format(r.status_code))
        r_body = r.json()
        res_code, res = r_body.get('res_code'), r_body.get('res')
        if int(res_code) != 0:
            raise MapApiError("地图API接口返回错误码：{} 错误信息{}".format(res_code, res))
        message = r_body.get('message')
        result = {}
        if message:
            points = []
            geo_text = message[0]['geom'][9:-2]

            for geo in geo_text.split(','):
                x, y = geo.split(' ')
                m_x, m_y = self.ll_to_mc(float(x), float(y))
                points.append((m_x, m_y))
            result['flag'] = 1
            result['code'] = message[0]['bgcode']
            result['point_list'] = points
        else:
            result['flag'] = 0
            result['message'] = '未查询到网格'
        return result

    @classmethod
    def ll_to_mc(cls, x, y):
        to_x = x * 20037508.34 / 180
        to_y = math.log(math.tan((90 + y) * math.pi / 360)) / (math.pi / 180)
        to_y = to_y * 20037508.34 / 180
        return dict(x=to_x, y=to_y)

    @classmethod
    def mc_to_ll(cls, x, y):
        to_x = x / 20037508.34 * 180
        to_y = y / 20037508.34 * 180
        to_y = 180 / math.pi * (2 * math.atan(math.exp(to_y * math.pi / 180)) - math.pi / 2)
        return to_x, to_y
