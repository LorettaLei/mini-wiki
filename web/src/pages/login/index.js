import React from "react";
import { Form, Icon, Input, Button, message } from "antd";
import { connect } from "react-redux";
import "./style.styl";
import action from "./action";
import { setUserInfo } from "../../redux/action";
import md5 from "js-md5";

class LoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        action
          .login({
            account: values.username,
            passwd: md5(values.password)
          })
          .then(d => {
            if (d.status === 200) {
              let { setUserInfo } = this.props;
              setUserInfo(d.result);
              this.props.history.push("/sys/");
            } else {
              message.error(d.msg);
            }
          });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <div className="login__logo">
          <img src={require("../../asserts/images/logo.png")} alt="蜗牛睡眠" />
        </div>
        <h2 className="login__title">mini-wiki</h2>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator("username", {
              rules: [{ required: true, message: "帐号不能为空!" }]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="邮箱"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "密码不能为空!" }]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="密码"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
const mapDispathToProps = {
  setUserInfo
};
const Login = Form.create({ name: "normal_login" })(LoginForm);

export default connect(null, mapDispathToProps)(Login);
