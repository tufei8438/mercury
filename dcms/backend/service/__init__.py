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
from dcms.backend import db
from dcms.backend.models import BaseModel
from dcms.errors import IllegalArgumentError, DatabaseError


class DatabaseService(object):

    def __init__(self):
        self.db_session = db.session

    def save(self, model, model_class):
        if not isinstance(model_class, type) or not isinstance(model, (BaseModel, model_class)):
            raise IllegalArgumentError("参数必须是BaseModel类型")
        if model.id is None:
            self.db_session.add(model)
            self.db_session.commit()
            return model
        else:
            db_model = model_class.query.filter(model_class.id == model.id).first()
            if db_model:
                db_model.copy_from(model)
                self.db_session.commit()
                return model
            else:
                raise DatabaseError("更新实体{}失败，未能根据ID找到对应的数据库记录".format(str(model_class)))
