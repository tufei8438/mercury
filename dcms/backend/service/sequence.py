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
from dcms.backend.models import Sequence
from dcms.backend.service import DatabaseService
from dcms.errors import IllegalArgumentError


class SequenceService(DatabaseService):

    def next_seqno(self, name):
        sequence = self.get_sequence(name)
        if not sequence:
            raise IllegalArgumentError('无法找到{}所对应的序列'.format(name))
        if sequence.current is None:
            sequence.current = sequence.min
        else:
            sequence.current += sequence.step
            if sequence.current >= sequence.max:
                sequence.current = sequence.min
        self.save(sequence, Sequence)
        self.commit()
        return sequence.current

    def current_seqno(self, name):
        sequence = self.get_sequence(name)
        if not sequence:
            raise IllegalArgumentError('无法找到{}所对应的序列'.format(name))
        return sequence.current

    def get_sequence(self, name):
        return Sequence.query.filter(Sequence.name == name).first()

    def get_sequences(self):
        return Sequence.query.all()
