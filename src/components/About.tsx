export default function About() {
  return (
    <section className="py-24 bg-white" id="about">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <div className="absolute -inset-4 bg-purple-100 rounded-2xl transform rotate-3 z-0"></div>
              <div className="relative z-10 bg-gray-200 aspect-[4/5] rounded-xl overflow-hidden shadow-xl flex items-center justify-center text-gray-400">
                [Doctor Portrait]
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 space-y-6">
            <h4 className="text-purple-600 font-semibold tracking-wider uppercase text-sm">About The Doctor</h4>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Dedicated to Your Health & Well-being
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              With over 15 years of experience in Obstetrics and Gynecology, I am committed to providing comprehensive, compassionate, and personalized care for women at every stage of life.
            </p>
            <p className="text-gray-600 leading-relaxed">
              My philosophy centers around listening to my patients, understanding their unique concerns, and working together to develop the most effective treatment plans. Whether you are navigating pregnancy, dealing with complex gynecological issues, or seeking routine care, you are in expert hands.
            </p>
            
            <div className="pt-6 grid grid-cols-2 gap-6">
              <div className="border-l-4 border-purple-500 pl-4">
                <h5 className="text-3xl font-bold text-gray-900">15+</h5>
                <p className="text-sm text-gray-500 mt-1">Years Experience</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h5 className="text-3xl font-bold text-gray-900">5k+</h5>
                <p className="text-sm text-gray-500 mt-1">Happy Patients</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
