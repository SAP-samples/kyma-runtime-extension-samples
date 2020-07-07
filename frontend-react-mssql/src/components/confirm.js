import React from "react";
import { Dialog } from "fundamental-react/Dialog";
import { Button } from "fundamental-react/Button";

const Confirm = (props) => {
  return (
    <Dialog
      show={props.showDeleteDialog}
      actions={[
        <Button option="emphasized" name="delete">
          Delete
        </Button>,
        <Button name="cancel">Cancel</Button>,
      ]}
      onClose={props.onClose}
      title="Delete Order"
    >
      Are you sure you want to delete order {props.formData.order_id}?
    </Dialog>
  );
};

export default Confirm;
