import React from "react";
import { Dialog } from "fundamental-react/Dialog";
import { Button } from "fundamental-react/Button";
import { FormGroup, FormInput, FormItem, FormLabel, FormTextarea } from "fundamental-react/Forms";

const OrderForm = (props) => {
  return (
    <Dialog
      show={props.showOrderDialog}
      actions={[
        <Button option="emphasized" name="add" disabled={props.orderDialogSaveDisabled}>
          Save
        </Button>,
        <Button name="cancel">Cancel</Button>,
      ]}
      onClose={props.onClose}
      title={props.isEditMode ? "Edit Order" : "Add Order"}
    >
      <FormGroup>
        <FormItem>
          <FormLabel htmlFor="input-1" required>
            Order ID
          </FormLabel>
          <FormInput
            name="order_id"
            readOnly={props.isEditMode}
            value={props.formData.order_id}
            onChange={props.onChange}
          />
        </FormItem>
      </FormGroup>
      <FormGroup>
        <FormItem>
          <FormLabel htmlFor="input-2" required>
            Description
          </FormLabel>
          <FormTextarea name="description" value={props.formData.description} onChange={props.onChange} />
        </FormItem>
      </FormGroup>
    </Dialog>
  );
};

export default OrderForm;
