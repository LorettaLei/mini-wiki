import React from "react";
import { Form, Input, Button } from "antd";

class Reset extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
      let _this = this;
      console.log(this.props)
    this.props.form.validateFields((err, values) => {
      if (!err) {
        _this.props.submit(values.passwd);
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
        <Form.Item label="登录密码">
          {getFieldDecorator("passwd", {
            rules: [{ required: true, message: "密码不能为空!" }]
          })(<Input type="password" />)}
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
const resetPwdForm = Form.create({ name: "reset" })(Reset);
export default resetPwdForm;
