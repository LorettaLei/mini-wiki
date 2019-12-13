import React from "react";
import { Form, Input, Button, TreeSelect } from "antd";
import { connect } from "react-redux";
const { TreeNode } = TreeSelect;

class NormalLoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.submit(values);
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
    const menu = this.props.menu;
    const loop = (data, title) =>
      data.map(item => {
        if (!item.path) {
          return (
            <TreeNode
              value={title ? item.title + "," + title : item.title}
              key={item.title}
              title={item.title}
            >
              {item.children && item.children.length
                ? loop(item.children, title?(item.title + ',' + title):item.title)
                : ""}
            </TreeNode>
          );
        }
      });
    return (
      <Form
        {...formItemLayout}
        onSubmit={this.handleSubmit}
        className="login-form"
      >
        <Form.Item label="文档标题">
          {getFieldDecorator("title", {
            rules: [{ required: true, message: "标题不能为空!" }]
          })(<Input />)}
        </Form.Item>
        <Form.Item label="所属分类">
          {getFieldDecorator("nav", {
            rules: [{ required: true, message: "所属分类不能为空!" }]
          })(
            <TreeSelect dropdownStyle={{ maxHeight: 400, overflow: "auto" }}>
              {loop(menu, "")}
            </TreeSelect>
          )}
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

const mapStateProps = (state, ownProps) => ({
  menu: state.menu
});

export default connect(mapStateProps)(UserForm);
