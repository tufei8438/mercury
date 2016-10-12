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
from sqlalchemy.orm.instrumentation import ClassManager
from mercury.backend import db


class BaseModel(db.Model):

    __abstract__ = True

    def __str__(self):
        attr_names = self._get_attribute_names()
        attrs = ["%s=%s" % (attr_name, getattr(self, attr_name)) for attr_name in attr_names]
        return ",".join(attrs)

    def to_dict(self, excludes=(), include_none_value=True, **kwargs):
        dicts = dict()
        attr_names = self._get_attribute_names()
        for attr in attr_names:
            if not attr.startswith('_') and attr not in excludes:
                v = getattr(self, attr)
                if not include_none_value and v is None:
                    continue
                if isinstance(v, BaseModel):
                    v = v.to_dict()
                if attr in kwargs:
                    dicts[kwargs.get(attr)] = v
                else:
                    dicts[attr] = v
        return dicts

    def _get_attribute_names(self):
        """获取对象需要序列化的属性字段
        :return: list
        """
        sa_instance_state = getattr(self, ClassManager.STATE_ATTR, None)
        if sa_instance_state:
            attr_dct = sa_instance_state.attrs._data
            return attr_dct.keys()
        return self.__dict__

    def from_dict(self, dicts):
        keys = dicts.keys()
        for attr in self._get_attribute_names():
            if not attr.startswith('_') and attr in keys:
                setattr(self, attr, dicts.get(attr))
        return self

    def copy_from(self, other):
        assert type(other) == type(self)
        for attr in self._get_attribute_names():
            if not attr.startswith('_'):
                v = getattr(other, attr)
                if v is not None:
                    setattr(self, attr, v)


class Attachment(BaseModel):

    __tablename__ = 'attachment'

    id = db.Column(db.Integer, primary_key=True)
    attach_type = db.Column(db.Integer)
    attach_id = db.Column(db.Integer)
    media_type = db.Column(db.Integer)
    media_path = db.Column(db.String(256))
    create_time = db.Column(db.DateTime, nullable=False, server_default=db.text("CURRENT_TIMESTAMP"))


class Case(BaseModel):

    __tablename__ = 'case'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(32), nullable=False, unique=True, server_default=db.text("''"))
    source = db.Column(db.Integer, nullable=False, server_default=db.text("'1'"))
    name = db.Column(db.String(128), nullable=False, server_default=db.text("''"))
    category_type = db.Column(db.Integer, nullable=False, server_default=db.text("'1'"))
    parent_category_code = db.Column(db.String(4), nullable=False, server_default=db.text("''"))
    parent_category_name = db.Column(db.String(64), nullable=False, server_default=db.text("''"))
    category_code = db.Column(db.String(4), nullable=False, server_default=db.text("''"))
    category_name = db.Column(db.String(64), nullable=False, server_default=db.text("''"))
    description = db.Column(db.String(512))
    address = db.Column(db.String(512))
    longitude = db.Column(db.String(64))
    latitude = db.Column(db.String(64))
    grid_code = db.Column(db.String(64))
    obj_code = db.Column(db.String(64))
    reporter_usercode = db.Column(db.String(32))
    reporter_name = db.Column(db.String(64))
    reporter_phone = db.Column(db.String(16))
    reporter_address = db.Column(db.String(256))
    proc_inst_id = db.Column(db.String(64))
    begin_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)
    expect_end_time = db.Column(db.DateTime)
    status = db.Column(db.Integer)
    priority = db.Column(db.Integer, nullable=False, server_default=db.text("'1'"))


class CaseActivity(BaseModel):

    __tablename__ = 'case_activity'

    id = db.Column(db.Integer, primary_key=True)
    case_id = db.Column(db.Integer, nullable=False, index=True)
    task_id = db.Column(db.String(64), nullable=False, server_default=db.text("''"))
    name = db.Column(db.String(64))
    usercode = db.Column(db.String(32))
    status = db.Column(db.Integer)
    description = db.Column(db.String(512))
    begin_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)
    expect_end_time = db.Column(db.DateTime)
    remark = db.Column(db.String(128))


class Category(BaseModel):

    __tablename__ = 'category'

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.Integer, nullable=False, server_default=db.text("'1'"))
    parent_id = db.Column(db.Integer, nullable=False, server_default=db.text("'0'"))
    parent_code = db.Column(db.String(4))
    code = db.Column(db.String(4), nullable=False, server_default=db.text("''"))
    longcode = db.Column(db.String(4), nullable=False, server_default=db.text("''"))
    name = db.Column(db.String(64), nullable=False, server_default=db.text("''"))
    description = db.Column(db.String(256))
    icon = db.Column(db.String(256))
    order = db.Column(db.Integer, nullable=False, server_default=db.text("'1'"))


class Component(BaseModel):

    __tablename__ = 'component'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(32), nullable=False, server_default=db.text("''"))
    name = db.Column(db.String(64), nullable=False, server_default=db.text("''"))
    longitude = db.Column(db.String(64))
    latitude = db.Column(db.String(64))
    address = db.Column(db.String(256))
    grid_code = db.Column(db.String(32), nullable=False, server_default=db.text("''"))
    description = db.Column(db.String(128))
    status = db.Column(db.Integer, nullable=False, server_default=db.text("'1'"))
    collect_time = db.Column(db.DateTime)
    collect_user = db.Column(db.String(32))
    collect_dept_id = db.Column(db.Integer)
    verify_time = db.Column(db.DateTime)
    verify_user = db.Column(db.String(32))
    verify_dept_id = db.Column(db.Integer)
    manage_dept_id = db.Column(db.Integer)
    owner_dept_id = db.Column(db.Integer)
    maintain_dept_id = db.Column(db.Integer)
    update_time = db.Column(db.DateTime, nullable=False)


class Department(BaseModel):

    __tablename__ = 'department'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(32), nullable=False, unique=True, server_default=db.text("''"))
    type = db.Column(db.Integer)
    name = db.Column(db.String(64))
    description = db.Column(db.String(512))
    status = db.Column(db.Integer, nullable=False, server_default=db.text("'1'"))
    create_time = db.Column(db.DateTime, nullable=False, server_default=db.text("CURRENT_TIMESTAMP"))


class Event(BaseModel):

    __tablename__ = 'event'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(32), nullable=False, unique=True, server_default=db.text("''"))
    name = db.Column(db.String(64), nullable=False, server_default=db.text("''"))
    region_id = db.Column(db.Integer, nullable=False)
    dept_id = db.Column(db.Integer)
    update_time = db.Column(db.DateTime, nullable=False, server_default=db.text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))


class Grid(BaseModel):

    __tablename__ = 'grid'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(32), nullable=False, unique=True, server_default=db.text("''"))
    manage_usercode = db.Column(db.String(32), server_default=db.text("''"))
    supervisor_usercode = db.Column(db.String(32))
    status = db.Column(db.Integer)
    update_time = db.Column(db.DateTime, nullable=False, server_default=db.text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))


class Region(BaseModel):

    __tablename__ = 'region'

    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(32), nullable=False, server_default=db.text("''"))
    level = db.Column(db.Integer, nullable=False)
    code = db.Column(db.String(32), nullable=False, server_default=db.text("''"))
    longcode = db.Column(db.String(32), nullable=False, server_default=db.text("''"))
    order = db.Column(db.Integer, nullable=False)


class User(BaseModel):

    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    usercode = db.Column(db.String(32), nullable=False, unique=True, server_default=db.text("''"))
    user_type = db.Column(db.Integer, nullable=False, server_default=db.text("'1'"))
    name = db.Column(db.String(32), nullable=False, server_default=db.text("''"))
    phone = db.Column(db.String(16))
    department_id = db.Column(db.Integer)
    status = db.Column(db.Integer, nullable=False, server_default=db.text("'1'"))
    update_time = db.Column(db.DateTime)
    create_time = db.Column(db.DateTime, nullable=False, server_default=db.text("'0000-00-00 00:00:00'"))

