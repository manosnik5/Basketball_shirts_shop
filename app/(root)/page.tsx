import Hero from "@/components/Hero"
import { getEuroleagueTeams, getNBATeams } from "@/lib/actions/teams"
import Featured from "@/components/Featured"
import AnimatedHeading from "@/components/AnimatedHeading"


const page = async () => {
  const nbaTeams = await getNBATeams();
  const euroleagueTeams = await getEuroleagueTeams();

  return (
    <div className="bg-light-light">   
      <Hero />
      <div className="absolute top-223" id="teams"></div>
      <div className="flex justify-center pt-10">
        <AnimatedHeading>
          <h1 className="text-heading-2">NBA Teams</h1>
        </AnimatedHeading>
      </div>
      <Featured items={nbaTeams} type="team"/>  
      <div className="flex justify-center mx-auto sm:ml-0">
        <AnimatedHeading>
          <h1 className="text-heading-2 mx-auto">Euroleague Teams</h1>
        </AnimatedHeading>
      </div>
      <Featured items={euroleagueTeams} type="team"/>  
    </div>
  )
}

export default page