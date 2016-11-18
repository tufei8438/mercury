/**
 * Copyright (c) 2016 Smallpay Co. Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.smallpay.workflow.dcms;

import com.smallpay.workflow.dcms.entity.CaseInfo;
import com.smallpay.workflow.dcms.entity.Department;
import com.smallpay.workflow.dcms.entity.Grid;

public interface CityManageService {

    CaseInfo getCaseInfo(int caseId);

    void updateCaseInfoStatus(int caseId, int status);

    Department getDepartment(int departmentId);

    Grid getGrid(String code);
}
