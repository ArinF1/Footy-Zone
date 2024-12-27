import { observer } from "mobx-react-lite";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Search } from "../presenters/searchPresenter.jsx";
import { Details } from "../presenters/playerDetailPresenter.jsx";
import { Compare } from "../presenters/playerComparisonPresenter.jsx";
import { Favorites } from "../presenters/favoritesPresenter.jsx";
import { Login } from "../presenters/logInPresenter.jsx";
import { Register } from "../presenters/registerPresenter.jsx";
import { TopNavBar } from "../presenters/topNavBarPresenter.jsx";
import loadingscreen from "/src/images/loadingscreen.png";
import { Notification  } from "../presenters/notificationPresenter.jsx";
import { useEffect, useState } from "react";

/**
 * Creates a hash-based router for the application.
 * Defines the different routes and their corresponding components.
 *
 * @param {Object} reactiveModel - The reactive model that stores the application's state.
 * @returns {Router} - A React Router object for navigating between views.
 */
function makeRouter(reactiveModel) {
    return createHashRouter([
      { path: "/", element: reactiveModel.user ? <Search model={reactiveModel} /> : <Login model={reactiveModel} /> },
      { path: "/login", element: <Login model={reactiveModel} /> },
      { path: "/register", element: <Register model={reactiveModel} /> },
      { path: "/search", element: <Search model={reactiveModel} /> },
      { path: "/details", element: <Details model={reactiveModel} /> },
      { path: "/compare", element: <Compare model={reactiveModel} /> },
      { path: "/favorites", element: <Favorites model={reactiveModel} /> },
    ]);
  }
  
  const ReactRoot = observer(function (props) {
    const { model } = props;
    const [currentRoute, setCurrentRoute] = useState(window.location.hash.slice(1) || "/");

    useEffect(() => {
      const handleHashChange = () => {
        setCurrentRoute(window.location.hash.slice(1) || "/");
      };
  
      window.addEventListener("hashchange", handleHashChange);
  
      return () => {
        window.removeEventListener("hashchange", handleHashChange);
      };
    }, []);
    if(!model.ready){
      return(
      <div className="loading-details"><img src={loadingscreen} alt="Loading" /></div>
      );
    }  

    return (
      <div className="flexParent"> 
        <TopNavBar model={model} currentRoute={currentRoute} />
        <div className="mainContent">
          <RouterProvider router={makeRouter(model)} />
        </div>
        <Notification model={model} />
      </div>
    );
  });
  
  export { ReactRoot };