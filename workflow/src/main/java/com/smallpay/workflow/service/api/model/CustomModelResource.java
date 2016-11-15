package com.smallpay.workflow.service.api.model;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.activiti.engine.ActivitiException;
import org.activiti.engine.ActivitiIllegalArgumentException;
import org.activiti.engine.repository.Model;
import org.activiti.rest.service.api.repository.BaseModelResource;
import org.activiti.rest.service.api.repository.ModelRequest;
import org.activiti.rest.service.api.repository.ModelResponse;
import org.apache.commons.io.IOUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;

@RestController
public class CustomModelResource extends BaseModelResource {

    @RequestMapping(value = "/service/repository/models", method = RequestMethod.POST, produces = "application/json")
    public ModelResponse createModel(@RequestBody ModelRequest modelRequest, HttpServletRequest request, HttpServletResponse response) {
        Model model = repositoryService.newModel();
        model.setCategory(modelRequest.getCategory());
        model.setDeploymentId(modelRequest.getDeploymentId());
        model.setKey(modelRequest.getKey());
        model.setMetaInfo(modelRequest.getMetaInfo());
        model.setName(modelRequest.getName());
        model.setVersion(modelRequest.getVersion());
        model.setTenantId(modelRequest.getTenantId());

        repositoryService.saveModel(model);
        setModelSource(model);
        response.setStatus(HttpStatus.CREATED.value());
        return restResponseFactory.createModelResponse(model);
    }

    @RequestMapping(value = "/service/repository/models/{modelId}/xml", method = RequestMethod.GET)
    public void exportModel(@PathVariable("modelId") String modelId, HttpServletResponse response) {
        Model modelData = repositoryService.getModel(modelId);
        if (modelData == null) {
            throw new ActivitiIllegalArgumentException("Invalid modelId:" + modelId);
        }

        OutputStream out = null;
        try {
            JsonNode editorNode = new ObjectMapper().readTree(repositoryService.getModelEditorSource(modelData.getId()));
            BpmnJsonConverter jsonConverter = new BpmnJsonConverter();
            BpmnModel model = jsonConverter.convertToBpmnModel(editorNode);
            String filename = model.getMainProcess().getId() + ".bpmn20.xml";
            byte[] bpmnBytes = new BpmnXMLConverter().convertToXML(model);

            out = response.getOutputStream();
            response.setHeader("Content-Disposition", "attachment; filename=" + filename);
            response.setContentType("application/xml; charset=utf-8");
            out.write(bpmnBytes);
            out.flush();
        } catch (IOException e) {
            throw new ActivitiException("export model error", e);
        } finally {
            IOUtils.closeQuietly(out);
        }
    }

    private void setModelSource(Model model) {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode node = objectMapper.createObjectNode();
        node.put("id", "canvas");
        node.put("resourceId", "canvas");
        ObjectNode stencilSetNode = objectMapper.createObjectNode();
        stencilSetNode.put("namespace", "http://b3mn.org/stencilset/bpmn2.0#");
        node.set("stencilset", stencilSetNode);

        try {
            repositoryService.addModelEditorSource(model.getId(), node.toString().getBytes("utf-8"));
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
    }
}