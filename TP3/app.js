const app = Vue.createApp({
    data(){
        return {
            products : [],
            searchQuery : "",
            selectedCategorie: "All",
            selectedDispo : "All",
            selectedSort: "none",
            panier: [],
        }
    },
    methods:{
        ajouterAuPanier(product) {
        // Check if product is already in cart
        const existing = this.panier.find(item => item.id === product.id);
        //increase quantity
        if (existing) {
            existing.quantite += 1;
        }
        else {
            this.panier.push({
            ...product, // copy product details
            quantite: 1
            });
        }
    }
    },
    mounted() {
        fetch("pieces-autos.json")
        .then(res=>res.json())
        .then(data => this.products=data)
        .catch(err => console.log(err.message))
    },
    computed:{
        categories(){
            const cats = this.products.map(p=>p.categorie); //array that will contain all the categories
            return [... new Set(cats)]; //remove dublicates
        },
        totalPanier() {
            return this.panier.reduce((sum, item) => sum + item.prix * item.quantite, 0);
        },

        filteredProducts() {
        let result = this.products;

      // --- Search filter ---
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            result = result.filter(p => p.nom.toLowerCase().includes(query));
        }

      // --- Category filter ---
        if (this.selectedCategorie !== "All") {
            result = result.filter(p => p.categorie === this.selectedCategorie);
        }
      // --- Availability filter ---
        if (this.selectedDispo === "disponible") {
            result = result.filter(p => p.disponible === true);}
        else if (this.selectedDispo === "rupture") {
            result = result.filter(p => p.disponible === false);
    }
       // --- Sorting by price ---
        if (this.selectedSort === "asc") {
            result = result.slice().sort((a, b) => a.prix - b.prix);}
        else if (this.selectedSort === "desc") {
            result = result.slice().sort((a, b) => b.prix - a.prix);
        }

      return result;
    }
  }
    
})
app.mount('#app');

