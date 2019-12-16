import React from "react";
import { PageHeader, Button, Table, Modal, message, Popconfirm } from "antd";
import "./style.styl";
import UserForm from "./userForm";
import ResetPwdForm from "./resetPwdForm";
import action from "./action";
import tool from "../../utils/tool";
import md5 from "js-md5";

class User extends React.Component {
  state = {
    dialogShow: false,
    tableData: [],
    pager: {},
    resetAccount: '',
    resetFormShow: false
  };
  UNSAFE_componentWillMount() {
    this.getTableData(1);
  }
  getTableData = pageNo => {
    action
      .getUser({
        pageNo: pageNo || this.state.pager.pageNo || 1,
        pageSize: 10
      })
      .then(d => {
        if (d.status === 200) {
          let pager = { ...this.state.pager };
          pager.total = d.total;
          let tableData = d.result.map(ele => {
            let obj = ele;
            obj["key"] = ele.account;
            return obj;
          });
          this.setState({
            tableData: tableData,
            pager: pager
          });
        } else {
          message.error("数据获取失败");
        }
      });
  };
  jump = pagination => {
    let pager = { ...this.state.pager };
    pager.pageNo = pagination.current;
    this.setState({
      pager: pager
    });
    this.getTableData(pager.pageNo);
  };
  addUser = () => {
    this.setState({ dialogShow: false });
    this.getTableData();
  };
  deleteUser = id => {
    action.delUser({ id: id }).then(d => {
      if (d.status === 200) {
        message.success("操作成功");
        this.getTableData();
      } else {
        message.error(d.msg);
      }
    });
  };
  resetP = (account) => {
    this.setState({
      resetAccount: account,
      resetFormShow: true
    })
  }
  resetPwd = (pwd) => {
    action.updateUser({
      account: this.state.resetAccount,
      passwd: md5(md5(pwd) + "snail").slice(0, 20),
    }).then(d => {
      if (d.status === 200) {
        message.success('操作成功')
        this.setState({
          resetAccount: '',
          resetFormShow: false
        })
      } else {
        message.error(d.msg)
      }
    })
  }
  render() {
    const { tableData } = this.state;
    const columns = [
      {
        title: "用户名",
        dataIndex: "username",
        key: "username"
      },
      {
        title: "邮箱",
        dataIndex: "account",
        key: "account"
      },
      {
        title: "是否管理员",
        dataIndex: "admin",
        render: (text, row) => {
          return <span>{row.admin ? "是" : "否"}</span>;
        }
      },
      {
        title: "创建日期",
        dataIndex: "created",
        render: (text, row) => {
          return <span>{tool.timestampToDate(row.created)}</span>;
        }
      },
      {
        title: "最后登录",
        dataIndex: "updated",
        render: (text, row) => {
          return (
            <span>
              {row.lastLogin ? tool.timestampToDateTime(row.lastLogin) : "无"}
            </span>
          );
        }
      },
      {
        title: "操作",
        dataIndex: "id",
        render: (text, row) => {
          return (
            <div>
            <a className="a__table" onClick={()=>{this.resetP(row.account)}}>重置密码</a>
            <Popconfirm
              title={`是否永久 ${row.username} 的帐号?`}
              onConfirm={() => this.deleteUser(row._id)}
            >
              <a className="danger">删除</a>
              </Popconfirm>
            </div>
          );
        }
      }
    ];
    return (
      <div className="user">
        <PageHeader
          ghost={false}
          title="用户管理"
          extra={[
            <Button
              key="add"
              onClick={() => {
                this.setState({ dialogShow: true });
              }}
            >
              添加用户
            </Button>
          ]}
        >
          <Table
            size="small"
            key="unique"
            dataSource={tableData}
            columns={columns}
            pagination={this.state.pager}
            onChange={this.jump}
          />
        </PageHeader>
        <Modal
          title="添加用户"
          visible={this.state.dialogShow}
          onCancel={() => {
            this.setState({ dialogShow: false });
          }}
          footer={""}
        >
          <UserForm addUser={this.addUser} />
        </Modal>
        <Modal
          title="重置密码"
          visible={this.state.resetFormShow}
          onCancel={() => {
            this.setState({ resetFormShow: false });
          }}
          footer={""}
        >
          <ResetPwdForm submit={this.resetPwd} />
        </Modal>
      </div>
    );
  }
}
export default User;
