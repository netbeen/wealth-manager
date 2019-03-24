import React, { Component } from 'react';
import Nav from '../../../components/nav';
import { Button, Dropdown, Menu, DatePicker, Card, Feedback, Input } from '@alife/aisc';
import { withRouter } from 'react-router-dom';
import exceed from 'utils/apimap';
import { formatTimeStampToYYYYMMDD } from 'utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import FormattedCurrency from '../../../components/formattedCurrency';

Feedback.toast.setConfig({
  hasMask: true,
});

class WealthRecordDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentEditWealthRecordData: [],
      selectedDate: new Date(),
      submitButtonLoading: false,
      currentRecordId: props.match.params.recordId && parseInt(props.match.params.recordId),
    };
  }

  componentDidMount() {
    this.props.fetchWealthRecordArray();
    this.props.fetchWealthCategoryArray();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.wealthRecordArray.length !== 0) {
      this.state.currentRecordId && setTimeout(() => {
        this.loadTargetRecord();
      }, 500);
    }
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
      .filter((wealthRecordDataItem) => {
        return wealthRecordDataItem.category.type === type;
      })
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
              defaultValue={wealthRecordDataItem.value}
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
    const { wealthRecordArray, wealthCategoryFlatArray, wealthCategoryOrderArray } = this.props;
    const categoryOrderIds = wealthCategoryOrderArray.map(item => item.id);
    if (wealthRecordArray.length > 0) {
      this.setState({
        currentEditWealthRecordData: wealthRecordArray[wealthRecordArray.length - 1].wealthRecordItems.map(item => {
          return {
            categoryId: item.categoryId,
            value: parseFloat(item.value) || null,
            category: wealthCategoryFlatArray.filter(category => category.id === item.categoryId)[0],
          };
        }).sort((a, b) => {
          return categoryOrderIds.indexOf(a.categoryId) - categoryOrderIds.indexOf(b.categoryId);
        }),
      });
    }
  }

  loadTargetRecord = () => {
    const { currentRecordId } = this.state;
    const { wealthRecordArray, wealthCategoryFlatArray, wealthCategoryOrderArray } = this.props;
    const categoryOrderIds = wealthCategoryOrderArray.map(item => item.id);
    const targetRecord = wealthRecordArray.filter(item => item.id === currentRecordId)[0];
    if (wealthRecordArray.length > 0) {
      this.setState({
        selectedDate: new Date(targetRecord.date),
        currentEditWealthRecordData: targetRecord.wealthRecordItems.map(item => {
          return {
            categoryId: item.categoryId,
            value: parseFloat(item.value),
            category: wealthCategoryFlatArray.filter(category => category.id === item.categoryId)[0],
          };
        }).sort((a, b) => {
          return categoryOrderIds.indexOf(a.categoryId) - categoryOrderIds.indexOf(b.categoryId);
        }),
      });
    }
  }

  render() {
    const {
      submitButtonLoading,
      currentEditWealthRecordData,
      selectedDate, currentRecordId,
    } = this.state;
    const {
      wealthCategoryTreeArray,
      wealthCategoryFlatArray,
    } = this.props;

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
                  const categoryDetail = wealthCategoryFlatArray.filter(item => item.id === parseInt(selectedKeys))[0];
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
                  {this.generateMenus(wealthCategoryTreeArray.filter(item => item.type === 'asset'))}
                </Menu.PopupItem>
                <Menu.PopupItem label="负债" key={-2}>
                  {this.generateMenus(wealthCategoryTreeArray.filter(item => item.type === 'debt'))}
                </Menu.PopupItem>
              </Menu>
            </Dropdown>
            <Button type="normal" onClick={this.importLastRecordCategory} style={{ marginRight: 20 }}>导入历史记录</Button>
            <DatePicker
              value={selectedDate}
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
              <FormattedCurrency
                value={currentEditWealthRecordData.reduce((accumulator, item) => {
                  if (item.category.type === 'debt') {
                    return accumulator - item.value;
                  }
                  return accumulator + item.value;
                }, 0)}
              />
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
                  api: currentRecordId ? 'putWealthRecord' : 'postWealthRecord',
                  params: {
                    id: currentRecordId,
                  },
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
                    this.props.history.push(currentRecordId ? '/wealth/record' : '/wealth');
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

export default connect(
  ({ index, ...others }) => ({ ...index, ...others }),
  dispatch => bindActionCreators(actions, dispatch)
)(withRouter(WealthRecordDetail));
