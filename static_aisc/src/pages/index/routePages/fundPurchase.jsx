import React, { Component } from 'react';
import Nav from '../../../components/nav';
import { Button, Form, Input, DatePicker, Feedback, Grid, Field } from '@alife/aisc';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { datePlus, formatTimeStampToYYYYMMDD } from 'utils';
import exceed from 'utils/apimap';

import * as actions from '../actions/index';

const { Row, Col } = Grid;

class FundDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fundData: null,
      fundTransactionDate: datePlus(new Date(), -1),
    };
    this.field = new Field(this);
    if (this.props.match.params.identifier) {
      this.field.setValue('identifier', this.props.match.params.identifier);
    }
  }

  componentDidMount() {
    if (this.props.match.params.identifier) {
      exceed.fetch({
        api: 'getFundData',
        params: {
          identifier: this.props.match.params.identifier,
        },
      }).then((res) => {
        if (res.code !== 200) {
          this.setState({
            fundData: null,
          });
          return;
        }
        this.setState({
          fundData: res.result,
        });
      });
    }
  }

  componentWillMount() {
  }

  userExists = (rule, value, callback) => {
    if (!/^\d{6}$/.test(value)) {
      return callback([new Error('基金代码格式错误')]);
    }
    exceed.fetch({
      api: 'getFundData',
      params: {
        identifier: value,
      },
    }).then((res) => {
      if (res.code !== 200) {
        this.setState({
          fundData: null,
        });
        return callback([new Error('没有对应的基金信息，请联系饲养员')]);
      }
      this.setState({
        fundData: res.result,
      });
      callback();
    });
  }

  checkCurrencyFormat = (rule, value, callback) => {
    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      return callback([new Error('货币格式错误')]);
    }
    callback();
  }

  /**
   * 从stringify后的数组中解析出当天的净值
   * @param stringifyArray
   * @param targetDate
   * @returns {*}
   */
  getNetValue = (stringifyArray, targetDate) => {
    if (!stringifyArray) {
      return '';
    }
    let array = [];
    try {
      array = JSON.parse(stringifyArray);
    } catch (e) {
      return console.error(e);
    }
    const targetItem = array.filter(item => (
      targetDate.getFullYear() === parseInt(item[0].slice(0, 4)) &&
      targetDate.getMonth() + 1 === parseInt(item[0].slice(4, 6)) &&
      targetDate.getDate() === parseInt(item[0].slice(6, 8))
    ));
    if (targetItem.length === 0) {
      return '无该日数据';
    }
    return targetItem[0][1];
  }

  render() {
    const { fundData, fundTransactionDate } = this.state;
    const { init } = this.field;

    const formItemLayout = {
      labelCol: {
        fixedSpan: 10,
      },
      wrapperCol: {
        span: 14,
      },
    };

    return (
      <div>
        <Nav />
        <div className="page-wealth-wrap">
          <Row type="wrap" >
            <Col span="24" >
              <Form size="large" direction="ver" field={this.field}>
                <Form.Item required hasFeedback label="基金代码" {...formItemLayout}>
                  <Input
                    disabled={typeof this.props.match.params.identifier !== 'undefined'}
                    {...init(
                      'identifier',
                      {
                        rules: [
                          { validator: this.userExists },
                        ],
                      }
                    )}
                    placeholder="基金代码"
                  />
                </Form.Item>
                <Form.Item label="基金名称" {...formItemLayout}>
                  <p className="next-form-text-align">{(fundData && fundData.name) || ''}</p>
                </Form.Item>
                <Form.Item label="交易日期" {...formItemLayout}>
                  <DatePicker
                    onChange={(inputDate) => {
                      this.setState({
                        fundTransactionDate: inputDate,
                      });
                    }}
                    hasClear={false}
                    defaultValue={fundTransactionDate}
                  />
                </Form.Item>
                <Form.Item label="单位净值" {...formItemLayout}>
                  <p className="next-form-text-align">{this.getNetValue(fundData && fundData.unitNetValue, fundTransactionDate)}</p>
                </Form.Item>
                <Form.Item label="累计净值" {...formItemLayout}>
                  <p className="next-form-text-align">{this.getNetValue(fundData && fundData.accumulatedNetValue, fundTransactionDate)}</p>
                </Form.Item>
                <Form.Item required label="交易金额" {...formItemLayout}>
                  <Input
                    {...init('value', {
                      rules: [
                        { validator: this.checkCurrencyFormat },
                      ],
                    })}
                    placeholder="交易金额"
                  />
                </Form.Item>
                <Form.Item required label="申购费用" {...formItemLayout}>
                  <Input
                    {...init('handingFee', {
                      rules: [
                        { validator: this.checkCurrencyFormat },
                      ],
                    })}
                    placeholder="申购费用"
                  />
                </Form.Item>
                <Form.Item label="" {...formItemLayout} >
                  <Button
                    type="primary"
                    onClick={() => {
                      if (!fundData) {
                        return Feedback.toast.error('无法获取基金信息');
                      } else if (!this.field.getValue('value')) {
                        return Feedback.toast.error('未填写交易金额');
                      } else if (!this.field.getValue('handingFee')) {
                        return Feedback.toast.error('未填写申购费用');
                      }
                      const sendData = {
                        identifier: fundData.identifier,
                        date: formatTimeStampToYYYYMMDD(fundTransactionDate),
                        value: (parseFloat(this.field.getValue('value')) - parseFloat(this.field.getValue('handingFee')))
                          / parseFloat(this.getNetValue(
                            fundData && fundData && fundData.unitNetValue,
                            fundTransactionDate
                          )), // 这里换算为交易份数
                        handingFee: this.field.getValue('handingFee'),
                      };
                      exceed.fetch({
                        api: 'postFundTransaction',
                        params: {
                          identifier: fundData.identifier,
                        },
                        data: sendData,
                      }).then((res) => {
                        console.log(res);
                        if (res.code === 200) {
                          if (this.props.match.params.identifier) {
                            this.props.history.push(`/fund/${this.props.match.params.identifier}`);
                          } else {
                            this.props.history.push('/fund');
                          }
                        }
                      });
                    }}
                  >
                    确定
                  </Button>
                  <Button
                    type="normal"
                    onClick={() => {
                      if (!fundData) {
                        return Feedback.toast.error('无法获取基金信息');
                      } else if (!this.field.getValue('value')) {
                        return Feedback.toast.error('未填写交易金额');
                      } else if (!this.field.getValue('handingFee')) {
                        return Feedback.toast.error('未填写申购费用');
                      }
                      const sendData = {
                        identifier: fundData.identifier,
                        date: formatTimeStampToYYYYMMDD(fundTransactionDate),
                        value: (parseFloat(this.field.getValue('value')) - parseFloat(this.field.getValue('handingFee')))
                          / parseFloat(this.getNetValue(
                            fundData && fundData && fundData.unitNetValue,
                            fundTransactionDate
                          )), // 这里换算为交易份数
                        handingFee: this.field.getValue('handingFee'),
                      };
                      exceed.fetch({
                        api: 'postFundTransaction',
                        params: {
                          identifier: fundData.identifier,
                        },
                        data: sendData,
                      }).then((res) => {
                        if (res.code === 200) {
                          return Feedback.toast.success('操作成功');
                        }
                      });
                    }}
                  >
                    再记一笔
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default connect(
  ({ index, ...others }) => ({ ...index, ...others }),
  dispatch => bindActionCreators(actions, dispatch)
)(withRouter(FundDashboard));
