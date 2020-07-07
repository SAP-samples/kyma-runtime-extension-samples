import React, { Component } from "react";
import { Table } from "fundamental-react/Table";
import { Button, ButtonGroup } from "fundamental-react/Button";
import { ActionBar } from "fundamental-react/ActionBar";
import { MessageStrip } from "fundamental-react/MessageStrip";
import { BusyIndicator } from "fundamental-react/BusyIndicator";
import OrderForm from "./orderForm";
import Confirm from "./confirm";
import * as API from "../api/orders";

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      showOrderDialog: false,
      showDeleteDialog: false,
      orderDialogSaveDisabled: true,
      messageStripClassName: "hideMsgStrip",
      messageStripText: "",
      isBusy: true,
      isEditMode: true,
      formData: {
        order_id: "",
        description: "",
      },
    };
  }

  onShowAdd() {
    this.setState({ showOrderDialog: true, isEditMode: false, formData: { order_id: "", description: "" } });
  }

  onShowEdit = (item) => {
    this.setState({
      showOrderDialog: true,
      isEditMode: true,
      orderDialogSaveDisabled: false,
      formData: {
        order_id: item.order_id,
        description: item.description,
      },
    });
  };

  onShowDeleteConfirm = (item) => {
    this.setState({ showDeleteDialog: true, formData: { order_id: item.order_id } });
  };

  async onAddOrder() {
    try {
      const data = {
        order_id: this.state.formData.order_id,
        description: this.state.formData.description,
      };
      const response = await API.addOrder(data);
      console.log(response);
      this.setState({ orders: this.state.orders.concat(response), isBusy: false, orderDialogSaveDisabled: true });
    } catch (err) {
      this.setState({ messageStripClassName: "showMsgStrip", messageStripText: String(err), isBusy: false });
    }
  }

  async onEditOrder() {
    try {
      const data = {
        order_id: this.state.formData.order_id,
        description: this.state.formData.description,
      };
      await API.updateOrder(data);
      const editedOrdIdx = this.state.orders.findIndex((obj) => obj.order_id === data.order_id);
      this.state.orders[editedOrdIdx].description = this.state.formData.description;
      const ordersEdited = this.state.orders;
      this.setState({ orders: ordersEdited, isBusy: false, orderDialogSaveDisabled: true });
    } catch (err) {
      this.setState({ messageStripClassName: "showMsgStrip", messageStripText: String(err), isBusy: false });
    }
  }

  onCloseDeleteDialog = async (event) => {
    if (event.currentTarget.name === "delete") {
      try {
        console.log(this.state.orders);
        await API.deleteOrder(this.state.formData.order_id);
        const deletedOrdIdx = this.state.orders.findIndex((obj) => obj.order_id === this.state.formData.order_id);
        this.state.orders.splice(deletedOrdIdx, 1);
        this.setState({ orders: this.state.orders, isBusy: false });
      } catch (err) {
        this.setState({ messageStripClassName: "showMsgStrip", messageStripText: String(err), isBusy: false });
      }
    }
    this.setState({ showDeleteDialog: false });
  };

  onCloseProductDialog = (event) => {
    if (event.currentTarget.name === "add") {
      if (this.state.isEditMode) {
        this.onEditOrder();
      } else {
        this.onAddOrder();
      }
    }
    this.setState({ showOrderDialog: false, orderDialogSaveDisabled: true });
  };

  async componentDidMount() {
    try {
      const response = await API.getOrders();
      this.setState({ orders: response, isBusy: false });
    } catch (err) {
      console.log(err);
      this.setState({ messageStripClassName: "showMsgStrip", messageStripText: String(err), isBusy: false });
    }
  }

  onChange = (event) => {
    console.log(event.target);
    if (event.currentTarget.name) {
      var formData = this.state.formData;
      formData[event.currentTarget.name] = event.currentTarget.value;
      this.setState({
        formData: formData,
      });
    }
    this.canSubmit();
  };

  canSubmit() {
    for (let value of Object.values(this.state.formData)) {
      if (value === "") {
        this.setState({ orderDialogSaveDisabled: true });
        return;
      }
    }
    this.setState({ orderDialogSaveDisabled: false });
  }

  render() {
    return (
      <div>
        <BusyIndicator show={this.state.isBusy} className="centered"></BusyIndicator>
        <MessageStrip dismissible className={this.state.messageStripClassName} type="error">
          {this.state.messageStripText}
        </MessageStrip>
        <OrderForm {...this.state} onClose={this.onCloseProductDialog} onChange={this.onChange} />
        <Confirm {...this.state} onClose={this.onCloseDeleteDialog} />

        <ActionBar title="Orders" actions={<Button glyph="add" onClick={() => this.onShowAdd()}></Button>} />
        <Table
          headers={["Order ID", "Description", "Created", "Actions"]}
          tableData={this.state.orders.map((item) => {
            return {
              rowData: [
                item.order_id,
                item.description,
                new Date(item.created).toLocaleString(),
                <ButtonGroup>
                  <Button glyph="delete" onClick={() => this.onShowDeleteConfirm(item)}></Button>
                  <Button glyph="edit" onClick={() => this.onShowEdit(item)}></Button>
                </ButtonGroup>,
              ],
            };
          })}
        />
      </div>
    );
  }
}
export default Orders;
