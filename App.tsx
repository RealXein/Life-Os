import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/store/AppContext";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import TasksPage from "@/pages/Tasks";
import HabitsPage from "@/pages/Habits";
import JournalPage from "@/pages/Journal";
import GoalsPage from "@/pages/Goals";
import FocusPage from "@/pages/Focus";
import CalendarPage from "@/pages/Calendar";
import StatsPage from "@/pages/Stats";
import ShopPage from "@/pages/Shop";
import ThemesPage from "@/pages/Themes";
import ProfilePage from "@/pages/Profile";
import CoachPage from "@/pages/Coach";
import SettingsPage from "@/pages/Settings";
import { SignIn, SignUp } from "@/pages/Auth";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ShellRoutes() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/tasks" component={TasksPage} />
        <Route path="/habits" component={HabitsPage} />
        <Route path="/journal" component={JournalPage} />
        <Route path="/goals" component={GoalsPage} />
        <Route path="/focus" component={FocusPage} />
        <Route path="/calendar" component={CalendarPage} />
        <Route path="/stats" component={StatsPage} />
        <Route path="/shop" component={ShopPage} />
        <Route path="/themes" component={ThemesPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/coach" component={CoachPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function Router() {
  const [location] = useLocation();
  if (location.startsWith("/auth/sign-in")) return <SignIn />;
  if (location.startsWith("/auth/sign-up")) return <SignUp />;
  return <ShellRoutes />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AppProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
