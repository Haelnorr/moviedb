import styles from "./styles.module.css";
const Home = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className={styles.title}>MovieDB</div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className={styles.tagline}>
            AKA the Untitled Movie Review Site
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className={styles.body}>
            <div className={styles.paragraph}>
              Welcome to the Untitled Movie Review website. The idea for this
              project is to offer a new take on movie reviews. To do that, there
              are two problems this project aims to provide solutions to.
            </div>
            <div className={styles.paragraph}>
              The first is a better aggregate rating system. The current norm
              for rating systems is bland at best, and unhelpful at worst. Users
              deserve a better way to see what other people thought of the
              movies they're looking up.
            </div>
            <div className={styles.paragraph}>
              The second is a better way to discover new movies. Deciding on a
              new movie to watch can be difficult, with potential spoilers
              looming behind every review, and too many options to choose.
            </div>
            <div className={styles.paragraph}>
              This project is still in its infancy, so for now those solutions
              are just ideas, but hopefully soon they'll be a reality,
            </div>
            <div className={styles.paragraph}>
              <a
                href="https://github.com/Haelnorr/moviedb"
                className={styles.gitlink}
              >
                Check out the Github repo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
