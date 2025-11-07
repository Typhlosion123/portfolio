'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Project = {
  id: number;
  title: string;
  status: string,
  shortDescription: string;
  longDescription: string;
  modalImage: string;
  githubLink: string;
};

const projectsData: Project[] = [
    {id: 1, title: "Time 2 Help", shortDescription: "Time 2 Help: Turn your goals into real stakes", status: "Ongoing (Awaiting Google Review)", longDescription: "Time 2 Help turns your screen time goals into real stakes. Set daily limits, attach a bounty, and stay accountable — if you miss your goal, your money is automatically donated to charity. It's a simple, motivating way to build better digital habits while making a positive impact. Chrome extension is done, on to Swift app. ", modalImage: "/time-2-help.png", githubLink: "https://github.com/Typhlosion123/time-to-help"}, 
    {id: 2, title: "Portfolio Website", shortDescription: "My Personal Website", status: "Ongoing (of course)", longDescription: "Welcome to my portfolio — a collection of projects that showcase my work at the intersection of artificial intelligence, data science, and systems engineering. From building predictive models that analyze the influence of social media on cryptocurrency markets, to developing neural networks for interpreting biosignals like sEMG, my projects highlight a focus on real-world problem solving through machine learning, data analysis, and automation.", modalImage: "/portfolio.png", githubLink: "https://github.com/Typhlosion123/portfolio"},
    {id: 3, title: "Meme Coin Prediction", shortDescription: "Meme coin prediction", status: "Ongoing", longDescription: "Meme-Coin Project is an AI-driven initiative that explores how social media buzz on X (formerly Twitter) and Reddit influences the price of meme coins, scam tokens, and other speculative cryptocurrencies. The project combines web scraping, sentiment analysis, and machine learning to collect and analyze online discussions, track community hype, and correlate these signals with market data such as price volatility and trading volume. By modeling the relationship between social sentiment and short-term price movements, the project aims to determine whether AI can reliably forecast hype-driven swings in the crypto market.", modalImage: "/meme-coin-image.png", githubLink: "https://github.com/Typhlosion123/Meme-Coin" },
    {id: 4, title: "Stealth EMG SVM", shortDescription: "Muscle fatigue indicator", status: "On hold till FA25", longDescription: "i-MADE Stealth Project is my personal research space focused on developing AI models to classify muscle fatigue from surface electromyography (sEMG) data. The project experiments with different neural network architectures, starting with simple dense models and extending to variations such as convolutional and recurrent networks to capture temporal and spatial signal patterns. The aim is to evaluate which approaches are most effective for interpreting biosignals and detecting fatigue, with potential applications in health monitoring, sports performance, and rehabilitation.", modalImage: "/stealth.png", githubLink: "https://github.com/Typhlosion123/Stealth-EMG-SVM"},
    {id: 5, title: "BMES Robotic Shoulder", shortDescription: "BMES Robotic Shoulder", status: "Completed (Presented at EOH)", longDescription: "his project focused on the design and development of a robotic shoulder joint, with the goal of creating a functional and mechanically efficient model that mimics the range of motion of the human shoulder. The design process emphasized biomechanical accuracy, durability, and adaptability, laying the groundwork for applications in robotics, prosthetics, and assistive technologies.", modalImage: "/shoulder.png", githubLink: "https://github.com/Typhlosion123/Robotic-Shoulder"}, 
    {id: 6, title: "DNA Bendabilty Project", shortDescription: "DNA Bendability Project", status: "Finished", longDescription: "This project explored how DNA sequence patterns influence the molecule’s bendability and structural flexibility, key properties that affect gene regulation and chromatin organization. The goal was to determine whether artificial intelligence models could learn sequence-level features that predict how easily a DNA strand can bend under biological conditions. Using curated genomic datasets, I trained and evaluated machine learning models—including dense neural networks and sequence-based architectures—to map raw nucleotide sequences to experimentally derived bendability scores.", modalImage: "", githubLink: "https://github.com/Typhlosion123/Kmer-Similarity"}, 
    {id: 7, title: "EasyAcumatica API", shortDescription: "EasyAcumatica API", status: "On Hold", longDescription: "Easy-Acumatica is a lightweight, Pythonic wrapper built around Acumatica’s contract-based REST API, designed to simplify integration for developers. It handles the complexities of session management, authentication, URL construction, and OData query building, allowing users to focus on their business logic instead of boilerplate code. Also in development is an agentic AI interface that allows for queries and responses from the API. ", modalImage: "/easy-acumatica.png", githubLink: "https://github.com/Nioron07/Easy-Acumatica"},
    {id: 8, title: "More to Come", shortDescription: "More Projects to Come!", status: "Ongoing", longDescription: "More projects from Chris Xu will be dropping soon. Check in on github for more consistent updates!", modalImage: "", githubLink: "https://github.com/Typhlosion123"}, 
];

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFading, setIsFading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    setIsFading(false);
  }, []);

  const handleClosePage = () => {
    setIsFading(true);
    setTimeout(() => {
      router.push('/computer');
    }, 500);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedProject) {
          setSelectedProject(null);
        } else {
          handleClosePage();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedProject, router]);

  if (!isClient) {
    return (
      <div style={{ backgroundColor: '#0F0909', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#B0AEA5' }}>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isFading ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 bg-black z-50 pointer-events-none"
      />

      <main className={`flex min-h-screen flex-col items-center justify-center p-4 md:p-8 transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundColor: '#0F0909' }}>
        
        <div className="w-full max-w-6xl rounded-lg shadow-2xl overflow-hidden relative" style={{ backgroundColor: '#EEF1DB' }}> 
          
          <motion.button
            onClick={handleClosePage}
            className="absolute top-4 right-4 font-mono z-20"
            style={{
              backgroundColor: '#FEF3A2', color: '#0F0909', border: '1px solid #D9D38B',
              boxShadow: '2px 2px 4px rgba(0,0,0,0.1)', transform: 'rotate(2deg)',
              width: '80px', height: '80px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1rem', padding: '0.5rem', textAlign: 'center'
            }}
            whileHover={{ scale: 1.05, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
          >
            Close (ESC)
          </motion.button>
          
          <div className="flex justify-between items-center p-4" style={{ backgroundColor: '#EEF1DB' }}>
              <h1 className="text-2xl font-mono" style={{ color: '#0F0909' }}>My Projects</h1>
          </div>

          <div className="p-8" style={{ backgroundColor: '#B0AEA5' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full">
              {projectsData.map((project) => (
                <motion.div
                  key={project.id}
                  className="cursor-pointer rounded-lg overflow-hidden flex flex-col items-center"
                  onClick={() => setSelectedProject(project)}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src={"/pixel_folder.png"}
                    alt={project.title}
                    width={200}
                    height={150}
                    className="object-contain w-full h-40"
                  />
                  <div className="p-4">
                    <p className="font-mono text-center" style={{ color: '#0F0909' }}>
                      {project.shortDescription}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="p-2 text-center text-xs font-mono" style={{ backgroundColor: '#EEF1DB', color: '#0F0909' }}>
            <div className="absolute bottom-2 right-4 w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            Press ESC to return to terminal
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
            onClick={() => setSelectedProject(null)} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden"
              style={{ backgroundColor: '#EEF1DB' }}
              onClick={(e) => e.stopPropagation()} 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-2 right-2 text-2xl font-bold z-10 p-2"
                style={{ color: '#0F0909' }}
              >
                &times;
              </button>
              <div className="p-6">
                <h2 className="text-3xl font-mono mb-4 text-center" style={{ color: '#0F0909' }}>
                  {selectedProject.title}
                </h2>
                <div className="flex justify-center mb-4">
                  <Image
                    src={selectedProject.modalImage}
                    alt={selectedProject.title}
                    width={300}
                    height={200}
                    className="object-contain rounded-md border-2"
                    style={{ borderColor: '#0F0909' }}
                  />
                </div>
                <p className="font-mono mb-6" style={({color: '#0F0909'})}>
                  Current Status: {selectedProject.status}
                </p>
                <p className="font-mono mb-6" style={{ color: '#0F0909' }}>
                  {selectedProject.longDescription}
                </p>
                <div className="text-center">
                  <a
                    href={selectedProject.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2 hover:bg-opacity-90 text-white rounded transition-colors font-mono"
                    style={{ backgroundColor: '#0F0909' }}
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}