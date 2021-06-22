import { Switch, Route } from 'react-router-dom'
function Main() {
  return (
    <main>
      <Switch>
        <Route exact path='/' component={Register}/>
        <Route path='/register' component={Register}/>
        <Route path='/upgrade' component={Upgrade}/>
      </Switch>
    </main>
  );
}