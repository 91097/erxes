import { Alert, Bulk, core, router } from 'erxes-ui-utils';
import gql from 'graphql-tag';
import * as compose from 'lodash.flowright';
import React from 'react';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import CarsList from '../components/list/CarsList';
import {
  // mutations,
  queries
} from '../graphql';
import {
  // DefaultColumnsConfigQueryResponse,
  IRouterProps,
  // ListConfigQueryResponse,
  ListQueryVariables,
  MainQueryResponse,
  // MergeMutationResponse,
  // MergeMutationVariables,
  // RemoveMutationResponse,
  // RemoveMutationVariables
} from '../types';

export const { withProps } = core;
export const { generatePaginationParams } = router

type Props = {
  queryParams: any;
  history: any;
};

type FinalProps = {
  carsMainQuery: MainQueryResponse;
  // carsListConfigQuery: DefaultColumnsConfigQueryResponse;
} & Props &
  IRouterProps; // &
  // RemoveMutationResponse &
  // MergeMutationResponse;

type State = {
  loading: boolean;
};

class CarListContainer extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  render() {
    const {
      carsMainQuery,
      // carsListConfigQuery,
      // carsRemove,
      // carsMerge,
      history
    } = this.props;
    // let columnsConfig = carsListConfigQuery.fieldsDefaultColumnsConfig || [];

    // load config from local storage
    // const localConfig = localStorage.getItem('erxes_cars_columns_config');

    // if (localConfig) {
    //   columnsConfig = JSON.parse(localConfig).filter(conf => conf.checked);
    // }

    // const removeCars = ({ carIds }, emptyBulk) => {
    //   carsRemove({
    //     variables: { carIds }
    //   })
    //     .then(() => {
    //       emptyBulk();
    //       Alert.success('You successfully deleted a car');
    //     })
    //     .catch(e => {
    //       Alert.error(e.message);
    //     });
    // };

    // const mergeCars = ({ ids, data, callback }) => {
    //   carsMerge({
    //     variables: {
    //       carIds: ids,
    //       carFields: data
    //     }
    //   })
    //     .then(response => {
    //       Alert.success('You successfully merged cars');
    //       callback();
    //       history.push(`/cars/details/${response.data.carsMerge._id}`);
    //     })
    //     .catch(e => {
    //       Alert.error(e.message);
    //     });
    // };

    const searchValue = this.props.queryParams.searchValue || '';
    const { list = [], totalCount = 0 } = carsMainQuery.carsMain || {};

    const updatedProps = {
      ...this.props,
      // columnsConfig,
      totalCount,
      searchValue,
      cars: list,
      loading: carsMainQuery.loading || this.state.loading,
      // removeCars,
      // mergeCars
    };

    const carsList = props => {
      return <CarsList {...updatedProps} {...props} />;
    };

    const refetch = () => {
      this.props.carsMainQuery.refetch();
    };

    return <Bulk content={carsList} refetch={refetch} />;
  }
}

const generateParams = ({ queryParams }) => ({
  variables: {
    ...generatePaginationParams(queryParams),
    segment: queryParams.segment,
    tag: queryParams.tag,
    brand: queryParams.brand,
    ids: queryParams.ids,
    categoryId: queryParams.categoryId,
    searchValue: queryParams.searchValue,
    sortField: queryParams.sortField,
    sortDirection: queryParams.sortDirection
      ? parseInt(queryParams.sortDirection, 10)
      : undefined
  }
});

export default withProps<Props>(
  compose(
    graphql<{ queryParams: any }, MainQueryResponse, ListQueryVariables>(
      gql(queries.carsMain),
      {
        name: 'carsMainQuery',
        options: generateParams
      }
    ),
    // graphql<{}, ListConfigQueryResponse, {}>(gql(queries.carsListConfig), {
    //   name: 'carsListConfigQuery'
    // }),
    // mutations
    // graphql<{}, RemoveMutationResponse, RemoveMutationVariables>(
    //   gql(mutations.carsRemove),
    //   {
    //     name: 'carsRemove'
    //   }
    // ),
    // graphql<{}, MergeMutationResponse, MergeMutationVariables>(
    //   gql(mutations.carsMerge),
    //   {
    //     name: 'carsMerge',
    //     options: {
    //       refetchQueries: ['carsMain', 'carCounts']
    //     }
    //   }
    // )
  )(withRouter<IRouterProps, React.ComponentType<IRouterProps>>(CarListContainer))
);
