export function CurrencyCard({ currency, altText, currentRate, change, changeColor, imageUrl }) {
    return (
        <section className="flex flex-col  max-md:ml-0 max-md:w-full">
            <article className="flex card-currency flex-col grow justify-center px-3 py-4 mx-auto w-full bg-sky-900 rounded-lg shadow-sm">
                <div className="flex gap-5 justify-between pr-2.5 text-xs whitespace-nowrap">
                    <div className="my-auto font-medium text-white">{currency}</div>
                    <div className="flex flex-col justify-center text-right uppercase">
                        <div className="text-white">{currency}</div>
                        <div className={changeColor}>{change}</div>
                    </div>
                </div>
                <div className="flex gap-5 justify-between mt-4 capitalize">
                    <div className="flex flex-col">
                        <div className="text-xs text-white text-opacity-80">Текущий курс</div>
                        <div className="mt-1 text-lg font-medium text-white">{currentRate}</div>
                    </div>
                    <img loading="lazy" src={imageUrl} className="shrink-0 my-auto aspect-[3.23] w-[78px]" alt={altText}/>
                </div>
            </article>
        </section>
    );
}
