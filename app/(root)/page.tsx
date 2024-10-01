import React from "react";
import HeaderBox from "@/components/HeaderBox";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import RightSidebar from "@/components/RightSidebar";
const Home = () => {
  const loggedIn = { firstName: "Aderian", lastName: "Oke", email: "aderianoke@gmail.com" };
  const sampleBanks: Bank[] = [
    { $id: "1", name: "crista", balance: 1000 },
    { $id: "2", name: "pikabo", balance: 2000 }
  ];
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || "Guest"}
            subtext="Access and manage yout account  and transaction efficiently"
          />
          <TotalBalanceBox
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1255.55}
          />
        </header>
       RecentTransactions
      </div>
      <RightSidebar user={loggedIn} transactions={[]} banks={sampleBanks} />
    </section>
  );
};

export default Home;
