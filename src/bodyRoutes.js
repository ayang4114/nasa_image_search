import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'
import App from './components/App'
import Search from './components/Search'

export default (
  <Route path='/' component={App}>
    <IndexRoute component={App} />
    <Route path='/search' component={Search} />
  </Route>
)