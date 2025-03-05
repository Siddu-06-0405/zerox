import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Printer, PackageCheck } from "lucide-react";

const Home = (props) => {
  const servicesAvailable = props.messages !== false;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 md:p-10">
      <div className="w-full max-w-md space-y-9">
        <LogoutButton />

        {/* Accepting Orders Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {servicesAvailable ? (
                <div className="flex items-center">
                  <span className="text-3xl">Accepting Orders</span>
                  <span className="ml-2 inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>
              ) : (
                <span className="text-3xl">Services Unavailable</span>
              )}
            </CardTitle>
            <CardDescription>
              {servicesAvailable
                ? "Our system is live and ready to process your orders."
                : "Our services are currently down for maintenance. Please check back later."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {servicesAvailable ? (
              <div className="flex flex-col gap-4">
                <Link to="/upload">
                  <Button className="w-full">Get Your Print Now <Printer size={24} className="inline-block mr-2" /></Button>
                </Link>
                <Link to="/ongoing">
                  
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Button variant="destructive" className="w-full" disabled>
                  Services Unavailable
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {servicesAvailable ? (
              <div  className="space-x-2   flex">
              <p className="text-sm text-gray-500">you can see all the orders which we are currently severing live here </p>
              <Button variant="outline" className="">
              Ongoing Orders
            </Button>

              </div>
              
            ) : (
              <p>Check back soon for updates.</p>
            )}
          </CardFooter>
        </Card>

     


        {/* Track Your Order Card */}
        <Card>
          <CardHeader>
            <CardTitle>Track Your Order</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              See your queue position and status: Printed, Ready, or Delivered.
            </p>
            <Separator className="my-4" />
            <Button size="lg" className="w-full " variant="outline">
              Track orders
              <PackageCheck size={24} />
            </Button>
          </CardContent>
        </Card>



        {/* Easy Pickup Card */}
        <Card>
          <CardHeader>
            <CardTitle>Easy Pickup</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Share a 4-digit hex code at the shop to collect your printouts.
            </p>
            <Separator className="my-4" />
            <div className="mt-4 flex justify-center gap-2">
              {["A", "F", "3", "B"].map((digit, index) => (
                <div
                  key={index}
                  className="w-12 h-12 border border-muted-foreground rounded flex items-center justify-center text-lg font-mono"
                >
                  <span className="text-muted-foreground">{digit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

           {/* Orders Processed Card */}
           {/* <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Orders Processed
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="text-4xl font-bold">800</div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Live</span>
              <span className="block h-3 w-3 rounded-full bg-green-500 animate-pulse" />
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default Home;
