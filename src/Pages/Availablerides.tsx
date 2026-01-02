import React, { useEffect, useState } from "react";
import { useAuth } from "../Hooks/useAuth";
import Redirect from "../Components/Redirect";
import axios from "axios";
import { Link } from "react-router-dom";
import RideDetailsCard from "../Components/RideDetailsCard";
import Header from "../Components/Header";
import { MdAddLocationAlt } from "react-icons/md";
import InstallBtn from "../Components/installBtn";

export const AvailableRidesComponent: React.FC = () => {
    const { user } = useAuth();
    const [rides, setRides] = useState<Ride[]>([]);

    const fetchRides = () => {
        axios.get(`/api/suggestions`)
            .then(res => {
                setRides(res.data.data);
            })
            .catch(err => {
                console.error("Error fetching suggestions", err);
            });
    };

    useEffect(() => {
        fetchRides();
    }, []);

    if (!user) {
        return <Redirect to="/start" />;
    }

    // Filter valid rides
    const validRides = rides.filter(ride =>
        ride && ride.owner && ride.stops && ride.stops.length >= 2
    );

    return (
        <div className="p-6 bg-gradient-to-b from-[#FFFFFF] to-[#C1EDE08C] min-h-screen relative">
           
            <div className="pt-4 pb-2 px-6 sticky w-screen -ml-6 top-0 bg-white/25 backdrop-blur-lg">
                <Header />
            </div>
         <InstallBtn />
            <section className="mt-4">
                <p className="connect text-[26px] font-Quicksand text-left font-[600]">
                    Connect. Ride. Save.
                </p>
                <p className="welcome text-[21px] text-[#01653F] font-Quicksand text-left font-[600]">
                    Welcome Back, {user.name}!
                </p>
                <div className="flex justify-between items-center gap-4">
                    <p className="ridematch text-[34px] text-[#008955] font-Quicksand text-left font-[700]">
                        Ride-Match
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="grow border border-[#B9B9B9]"></div>
                    <div className="w-fit font-Quicksand font-[700px] text-[#91908E]">
                        {new Date().toDateString()}
                    </div>
                    <div className="grow border border-[#B9B9B9]"></div>
                </div>
            </section>

            <main className="pb-60 mt-4">
                <ul className="flex flex-col gap-4">
                    {validRides.length === 0 ? (
                        <li className="p-4 border-[2px] border-gray-300 bg-gray-100 w-auto rounded-[10px] text-center text-neutral-700 font-[600]">
                            No rides available.
                        </li>
                    ) : (
                        validRides.map(ride => (
                            <RideDetailsCard
                                refreshRide={fetchRides}
                                key={ride.id}
                                ride={ride}
                            />
                        ))
                    )}

                    <li className="mt-4">
                        <p className="leading-5 text-neutral-700">
                            Unable to find a match? Fret not, click on the icon at the bottom right to post your ride.
                        </p>
                    </li>
                </ul>

                <Link
                    to="/create-ride"
                    className="fixed bottom-[86px] right-4 text-green-700 w-fit ml-auto max-w-60 text-center p-2 bg-green-600/25 backdrop-blur-sm border border-black border-solid rounded-full drop-shadow-2xl font-bold"
                >
                    <MdAddLocationAlt size={32} />
                </Link>
            </main>
        </div>
    );
};

export default AvailableRidesComponent;
