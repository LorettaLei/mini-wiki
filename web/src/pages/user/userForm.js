import React from "react";
import { Form, Input, Button, Switch, message } from "antd";
import action from "./action";
import md5 from "js-md5";

class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    let _this = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        action
          .addUser({
            username: values.username,
            account: values.account,
            passwd: md5(values.passwd),
            admin: values.admin || false
          })
          .then(d => {
            if (d.status === 200) {
              _this.props.addUser();
              message.success("添加成功");
            } else {
              message.error(d.msg);
            }
          });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    return (
      <Form
        {...formItemLayout}
        onSubmit={this.handleSubmit}
        className="login-form"
      >
        <Form.Item label="用户名">
          {getFieldDecorator("username", {
            rules: [{ required: true, message: "Please input your username!" }]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="邮箱">
          {getFieldDecorator("account", {
            rules: [
              { type: "email", message: "请输入正确的邮箱地址!" },
              { required: true, message: "邮箱不能为空!" }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="登录密码">
          {getFieldDecorator("passwd", {
            rules: [{ required: true, message: "密码不能为空!" }]
          })(<Input type="password" />)}
        </Form.Item>
        <Form.Item label="是否管理员">
          {getFieldDecorator("admin", { valuePropName: "checked" })(<Switch />)}
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
    );
  }
}
const UserForm = Form.create({ name: "normal_login" })(NormalLoginForm);
export default UserForm;
