import React from "react";
import { Form, Input, Button, message } from "antd";
import action from "./action";
import md5 from "js-md5";
import "./style.styl";
import { connect } from "react-redux";

class Setting extends React.Component {
  state = {
    confirmDirty: false
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { userInfo } = this.props;
        action
          .updateUser({
            account: userInfo.account,
            passwd: md5(md5(values.passwd) + "snail").slice(0, 20)
          })
          .then(d => {
            if (d.status === 200) {
              message.success("更新成功");
            } else {
              message.error(d.msg);
            }
          });
      }
    });
  };
  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };
  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(["rePasswd"], { force: true });
    }
    callback();
  };
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("passwd")) {
      callback("两次输入的密码不一致!");
    } else {
      callback();
    }
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="setting">
        <h2>修改登录密码</h2>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="登录密码" hasFeedback>
            {getFieldDecorator("passwd", {
              rules: [
                { required: true, message: "密码不能为空!" },
                { validator: this.validateToNextPassword }
              ]
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item label="确认密码" hasFeedback>
            {getFieldDecorator("rePasswd", {
              rules: [
                { required: true, message: "确认密码不能为空!" },
                { validator: this.compareToFirstPassword }
              ]
            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: 16, offset: 8 }
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
const SettingForm = Form.create({ name: "normal_login" })(Setting);
const stateData = (state, myprops) => ({
  userInfo: state.userInfo
});
export default connect(stateData)(SettingForm);
