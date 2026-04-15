from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.analytics_dashboard, name='analytics_dashboard'),
    path('predict/', views.predictive_analytics, name='predictive_analytics'),
    path('investment/', views.investment_analyzer, name='investment_analyzer'),
    path('insights/', views.market_insights, name='market_insights'),
    path('api/locality-data/', views.locality_data_api, name='locality_data_api'),
    path('predict/', views.predict_rent_analytics, name='predict_rent_api'),
    path('summary/', views.market_summary_api, name='market_summary_api'),
    path('50-insights/', views.market_insights_api, name='market_insights_api'),
    path('ml-predictions/', views.ml_predictions_api, name='ml_predictions_api'),
    path('add-property/', views.add_property_api, name='add_property_api'),
    path('ai-search/', views.ai_search_api, name='ai_search_api'),
]
