// Scroll animations
const animatedElements = document.querySelectorAll(".fade-in, .slide-up");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
});
animatedElements.forEach(el => observer.observe(el));

// Featured books data
const books = [
  {
    img: "book1.jpg",
    synopsis: `When haunted by the nightmares that prevent a way to their dreams, those who still choose to close their eyes will bear the signs of her artistry.

With the little she’d given, the spark of inspiration stretched to an end far beyond any protection of gates or the safe one seeks within havens.

And of all she could’ve gifted to see past the horrors along the way, they only ever chanted desires of her name.

It was their passion that carried the tales of the Musa’s empowerment to one with a mere peephole. Allowing him to bear witness to a world where he alone existed for her acknowledgment.

Revealing one of his own, as it is the five shapes used to define the ninth weren’t amongst the eight musae from whom he earned his accolades.

Despite all for which they meant––the many plaques branded with proof of his excellence over the rest––the value in the collection of the five wouldn’t end upon obtainment.

For it was the ninth that made the purest of golds leak from his mind, just like all those whom she sired after himself. That’s what’s led many men to in this story to death, chasing the woman all men hope to find in the end: his purpose.

His most prized, and not yet possessed.`
  },
  {
    img: "book2.jpg",
    synopsis: `You, the woman whose desires are serving a sentence in confinement—I would like to know, where does all your trust go, being that your environment is unsustainable for your cravings to grow?

Would you free yourself if you were capable?

You, the woman with a box tucked away in the back of your closet, filled to the brim with items you can only pull out in private—did you really think your achievements were enough to hide it?

To experience the fun of your darkness, would you come where the light is?

You, so daring in your fruitless attempts to silence your desires through untraceable browsers. It’s funny you can find the nerve to act surprised when the yearning got louder.

So how is it that you’re still afraid of your power?

I know who you are, the days your lover is none the wiser to where you’ve gone. And I couldn’t help but notice as you filled the absence in front of an audience, that you would increase the dosage with the more people that were watching.

When I ask, I hope you remember who it was that said you were so undeserving.

You, the woman so confidently lost on a path you didn’t pave, will you stop listening to words of They and accept the truth of how far you’ve been astray? As your Man of Reason, the only justification you ever needed was my name.

So it’s my pleasure to show you the way.

To free your waters and finally obtain

A life with less shame.`
  },
  {
    img: "book3.jpg",
    synopsis: `For you, the one who has been brought to your knees against your will, I realize that danger is the first your instincts will let you feel.

His intention as the dominant ruler over your body’s sensations, is to provide you with liberation from the world of shame you’ve managed to escape.

That’s why you came…or are you still ashamed?

Even so, to survive here in this world of His, you will have to push past your limits into the realm of ascension. But first, pay the price of admission and with it understand He will never accept the dividends of your ignorance.

So if you wish to be given His world, inch by inch, a conscious state is a must for the approaching moment when you’ll be cumming for Him with the hopes to collect the return on the investment you made when you gave him every penny of your trust.

But don’t be discouraged. In His world, you’d be surprised how so little can turn into so much.

You are warned to stay lucid because what you witness will make you question your absence of regret…because after all it was you, who fixed your pretty little mouth to beg Him for this.

The languages your tongue will learn to praise in will be the hymns your body moves through worship under the command of His dictatorship.

And though you may try to find the words, there will be no translation to commence the return where you believed you were safest.

In exchange of His needs met you will see there is more than what you’ve been promised.

Because in His world, the desires you tried to kill with neglect, will see there are no limits to bliss.`
  }
];

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxSynopsis = document.getElementById("lightbox-synopsis");
const closeBtn = document.querySelector(".close");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentIndex = 0;

// Open lightbox
document.querySelectorAll(".book").forEach(book => {
  book.addEventListener("click", () => {
    currentIndex = parseInt(book.dataset.index);
    if (!isNaN(currentIndex)) {
      lightbox.style.display = "flex";
      updateLightbox();
    }
  });
});

function updateLightbox() {
  lightboxImg.src = books[currentIndex].img;
  lightboxSynopsis.textContent = books[currentIndex].synopsis;
}

// Close lightbox
closeBtn.addEventListener("click", () => {
  lightbox.style.display = "none";
});
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) lightbox.style.display = "none";
});

// Navigate
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + books.length) % books.length;
  updateLightbox();
});
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % books.length;
  updateLightbox();
});