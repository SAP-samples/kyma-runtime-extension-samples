package dev.kyma.samples.trigger.controllers;

import dev.kyma.samples.trigger.model.OrderCreated;
import io.cloudevents.CloudEvent;
import io.cloudevents.v1.AttributesImpl;
import io.cloudevents.v1.http.Unmarshallers;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(path = "/")
public class SampleController {

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public void eventTrigger(@RequestHeader Map<String, Object> headers, @RequestBody String payload) {
        CloudEvent<AttributesImpl, OrderCreated> cloudEvent =
                Unmarshallers.binary(OrderCreated.class)
                        .withHeaders(() -> headers)
                        .withPayload(() -> payload)
                        .unmarshal();
        System.out.println(cloudEvent.getAttributes());
        System.out.println(cloudEvent.getData());

        //implement your business extension logic here
    }
}
