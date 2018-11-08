import gql from 'graphql-tag';
import { __, Alert, withProps } from 'modules/common/utils';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { List } from '../components';
import { mutations, queries } from '../graphql';
import { LinkedAccountsQueryResponse, RemoveMutationResponse } from '../types';

type Props = {
  accountsQuery: LinkedAccountsQueryResponse;
} & RemoveMutationResponse;

class ListContainer extends React.Component<Props> {
  render() {
    const { accountsQuery, integrationsDelinkAccount } = this.props;

    const delink = (accountId: string) => {
      integrationsDelinkAccount({
        variables: { _id: accountId }
      })
        .then(() => {
          Alert.success('Success');
        })
        .catch(e => {
          Alert.error(e.message);
        });
    };

    const updatedProps = {
      accounts: accountsQuery.integrationLinkedAccounts || [],
      delink
    };

    return <List {...updatedProps} />;
  }
}

export default withProps<{}>(
  compose(
    graphql<Props, LinkedAccountsQueryResponse>(gql(queries.linkedAccounts), {
      name: 'accountsQuery'
    }),
    graphql<Props, RemoveMutationResponse, { _id: string }>(
      gql(mutations.delinkAccount),
      {
        name: 'integrationsDelinkAccount',
        options: {
          refetchQueries: ['accountsQuery']
        }
      }
    )
  )(ListContainer)
);
