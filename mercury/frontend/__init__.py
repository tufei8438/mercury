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
from mercury import factory
from flask import render_template


def handle_error(e):
    return render_template('errors/%s.html' % e.code), e.code


def create_app(settings_override=None):
    app = factory.create_app(__name__, __path__, settings_override)
    if not app.debug:
        for e in [500, 404]:
            app.errorhandler(e)(handle_error)
    return app
