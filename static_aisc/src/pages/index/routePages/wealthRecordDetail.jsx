import React, { Component } from 'react';
import Nav from '../../../components/nav';
import { Button, Dropdown, Menu, DatePicker, Card, Feedback, Input } from '@alife/aisc';
import { withRouter } from 'react-router-dom';
import exceed from 'utils/apimap';
import { formatTimeStampToYYYYMMDD } from 'utils';

Feedback.toast.setConfig({
  hasMask: true,
});

class WealthRecordDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flatCategory: [],
      treeCategory: [],
      currentEditWealthRecordData: [],
      selectedDate: new Date(),
      wealthRecords: [],
      categoryOrderIds: [],
      submitButtonLoading: false,
      currentRecordId: props.match.params.recordId,
    };
  }

  componentDidMount() {
    this.fetchWealthCategory();
    this.fetchWealthRecords();
  }

  fetchWealthRecords = () => {
    exceed.fetch({
      api: 'getWealthRecord',
      data: {
        uuid: window.WM_GLOBAL.user.uuid,
      },
    }).then((res) => {
      this.setState({
        wealthRecords: res,
      });
    });
  }

  fetchWealthCategory = () => {
    exceed.fetch({
      api: 'getWealthCategory',
      data: {
        uuid: window.WM_GLOBAL.user.uuid,
      },
    }).then((res) => {
      this.setState({
        flatCategory: res,
      });

      const categoryWithChildren = res.map((item) => {
        return { ...item, children: [] };
      });
      categoryWithChildren.forEach((item) => {
        if (item.parentId !== -1) {
          categoryWithChildren.filter(
            (searchParentItem) => { return searchParentItem.id === item.parentId; }
          )[0].children.push(item);
        }
      });

      const treeCategory = categoryWithChildren.filter(item => item.parentId === -1);
      this.setState({
        treeCategory,
        categoryOrderIds: this.breadthFirstTraversal(treeCategory).map(item => item.id),
      });
    });
  }

  generateMenus = (inputCategory) => {
    return (
      <Menu>
        {inputCategory.map(item => {
          if (item.children.length === 0) {
            return <Menu.Item key={item.id}>{item.name}</Menu.Item>;
          }
          return (
            <Menu.PopupItem key={item.id} label={item.name}>
              {this.generateMenus(item.children)}
            </Menu.PopupItem>
          );
        })}
      </Menu>);
  }

  renderRecordItems = (type) => {
    const { currentEditWealthRecordData } = this.state;
    return currentEditWealthRecordData
      .filter((wealthRecordDataItem) => { return wealthRecordDataItem.category.type === type; })
      .map((wealthRecordDataItem) => {
        return (
          <div className="record-item">
            <span className="record-item-category">{wealthRecordDataItem.category.name}</span>
            <span className="record-item-operate-area">
              <Button
                shape="text"
                size="small"
                onClick={() => {
                  this.setState({
                    currentEditWealthRecordData: currentEditWealthRecordData.filter(item => item.categoryId !== wealthRecordDataItem.categoryId),
                  });
                }}
              >
                删除类目
              </Button>
            </span>
            <span className="placeholder" />
            <Input
              onChange={(value) => {
                if (value === '') {
                  value = 0;
                } else if (!/^[0-9]+\.?[0-9]*$/.test(value)) {
                  return Feedback.toast.error('金额错误');
                }
                wealthRecordDataItem.value = parseFloat(value);
                this.setState({ currentEditWealthRecordData });
              }}
              autoComplete={false}
              placeholder={`${wealthRecordDataItem.category.name}`}
              size="small"
            />
          </div>);
      });
  }

  importLastRecordCategory = () => {
    const { wealthRecords, flatCategory, categoryOrderIds } = this.state;
    if (wealthRecords.length > 0) {
      this.setState({
        currentEditWealthRecordData: wealthRecords[wealthRecords.length - 1].wealthRecordItems.map(item => {
          return {
            categoryId: item.categoryId,
            value: 0,
            category: flatCategory.filter(category => category.id === item.categoryId)[0],
          };
        }).sort((a, b) => { return categoryOrderIds.indexOf(a.categoryId) - categoryOrderIds.indexOf(b.categoryId); }),
      });
    }
  }

  breadthFirstTraversal = (treeCategory) => {
    const result = [];
    treeCategory.forEach((categoryLevel1) => {
      result.push(...categoryLevel1.children);
    });
    return result;
  }

  render() {
    const { submitButtonLoading,
      treeCategory, currentEditWealthRecordData, flatCategory, selectedDate } = this.state;

    console.log('currentRecordId',this.state.currentRecordId);
    return (
      <div>
        <Nav />
        <div className="page-wealth-create-wrap">
          <div className="top-area">
            <Dropdown
              triggerButton={
                <Button type="primary" style={{ marginRight: 20 }}>添加类目</Button>}
              triggerType="click"
            >
              <Menu
                onClick={(selectedKeys, menuItem, meta) => {
                  if (meta.keyPath.includes(String(selectedKeys))) {
                    return Feedback.toast.prompt('仅允许添加三级类目');
                  }
                  if (currentEditWealthRecordData.filter(item => item.categoryId === parseInt(selectedKeys)).length > 0) {
                    return Feedback.toast.prompt('类目不可以重复添加哦');
                  }
                  const categoryDetail = flatCategory.filter(item => item.id === parseInt(selectedKeys))[0];
                  this.setState({
                    currentEditWealthRecordData: [...currentEditWealthRecordData, {
                      categoryId: parseInt(selectedKeys),
                      value: 0,
                      category: categoryDetail,
                    }],
                  });
                }}
              >
                <Menu.PopupItem label="资产" key={-1}>
                  {this.generateMenus(treeCategory.filter(item => item.type === 'asset'))}
                </Menu.PopupItem>
                <Menu.PopupItem label="负债" key={-2}>
                  {this.generateMenus(treeCategory.filter(item => item.type === 'debt'))}
                </Menu.PopupItem>
              </Menu>
            </Dropdown>
            <Button type="normal" onClick={this.importLastRecordCategory} style={{ marginRight: 20 }}>导入历史类目</Button>
            <DatePicker
              defaultValue={new Date()}
              hasClear={false}
              onChange={(date) => {
                this.setState({ selectedDate: date });
              }}
            />
          </div>
          <Card style={{ marginTop: 20, width: '100%' }}>
            <div className="category-type">资产：</div>
            {this.renderRecordItems('asset')}
            <div className="category-type">负债：</div>
            {this.renderRecordItems('debt')}
            <div style={{ width: '100%', borderTop: '1px dashed #404354' }} />
            <div className="category-type">
              <div style={{ flexGrow: 1 }}>净资产：</div>
              <div>
                {`￥${currentEditWealthRecordData.reduce((accumulator, item) => {
                  if (item.category.type === 'debt') {
                    return accumulator - item.value;
                  }
                  return accumulator + item.value;
                }, 0).toFixed(2)}`}
              </div>
            </div>
          </Card>
          <div className="category-type" style={{ marginTop: 20, flexDirection: 'row-reverse' }}>
            <Button
              type="primary"
              loading={submitButtonLoading}
              onClick={() => {
                this.setState({
                  submitButtonLoading: true,
                });
                exceed.fetch({
                  api: 'postWealthRecord',
                  data: {
                    date: formatTimeStampToYYYYMMDD(selectedDate),
                    recordItemList: currentEditWealthRecordData,
                  },
                }).then(() => {
                  Feedback.toast.success({
                    content: '操作成功',
                    duration: 1000,
                  });
                  this.setState({
                    submitButtonLoading: false,
                  });
                  setTimeout(() => {
                    this.props.history.push('/wealth');
                  }, 1100);
                });
              }}
            >
              确定
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(WealthRecordDetail);
