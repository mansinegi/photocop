
var app= angular.module('MyApp',['ngRoute']);

app.config(['$routeProvider',function($routeProvider) {
  $routeProvider.
  when('/home', {
    templateUrl: 'pages/home.html',
    controller : 'HomeController as hmctrl',
    
  }).
  when('/profile', {
    templateUrl: 'pages/profile.html',
    controller : 'ProfileController as pfctrl',
    
  }).
  when('/details/:single', {
    templateUrl: 'pages/details.html',
    controller : 'DetailsController as dtctrl',
    
  }).
  otherwise({
  	redirectTo :'/home'
  });

}]);

app.factory('PictureService', ['$http',function($http){

	var favorites=[];
	var selectedPic="";
	return {
		    searchForPics : function(text,callback){
			
			return $http.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=35c222f3d1e5ffc6ba34a46caf5114f8&text="+text+"&per_page=5&format=json&nojsoncallback=1")
			.success(callback);
			},

			addToFavorites : function(pic){
				  favorites.push(pic);
				 
			},

			getFavorites  : function()
			{
				return favorites;
			},

			removeFavorite : function(pic){

				var index=favorites.indexOf(pic);
				favorites.splice(index,1);
			},

			getDetailsOfPic : function(photoId,callback){

				return $http.get("https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=35c222f3d1e5ffc6ba34a46caf5114f8&photo_id="+photoId+"&format=json&nojsoncallback=1")
				.success(callback);
			

			},

		}
		

}]);


app.controller('ProfileController', ['$http','PictureService',function($http,PictureService){

	var listOfFav=this;
	listOfFav.response=[];
	listOfFav.response=PictureService.getFavorites();
	this.removeFav=function(pic){

		PictureService.removeFavorite(pic);
	}

	
}]);

app.controller('DetailsController', ['$http','PictureService','$routeParams',function($http,PictureService,$routeParams){

	this.picIndex = $routeParams.single;
	var picsArray=this;
	this.selectPic=[];
	this.tab=1;
	picsArray.singlePic=[];
	var tagsArray=this;
	tagsArray.allTags=[];
	this.selectTab=function(newTab){
		this.tab=newTab;
	}

	this.isSelected=function(selectedTab){

		return this.tab===selectedTab;
	}
	

	this.selectPic= PictureService.getFavorites();
	this.single=this.selectPic[this.picIndex];

	PictureService.getDetailsOfPic(this.single.id,function(resp){

		picsArray.singlePic=resp.photo;
		tagsArray.allTags=picsArray.singlePic.tags.tag;
		console.log(tagsArray.allTags);


	});


}]);


app.controller('HomeController', ['$http','PictureService',function($http,PictureService){
	this.name="Mansi";
	var pictures=this;
	pictures.photos=[];

	this.searchFor=function(){
		PictureService.searchForPics(this.text, function(response){

			console.log(response);
			pictures.photos=response.photos.photo;

		});
	}

	this.addToFav=function(pic){
		
		PictureService.addToFavorites(pic);
		
	}

}]);