from flask import Blueprint, jsonify, request
from flask_app.services.analytics_service import AnalyticsService

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/summary', methods=['GET'])
def get_summary():
    summary = AnalyticsService.get_summary()
    return jsonify(summary)

@analytics_bp.route('/50-insights', methods=['GET'])
def get_insights():
    insights = AnalyticsService.get_50_insights()
    return jsonify(insights)

@analytics_bp.route('/ml-clusters', methods=['GET'])
def get_clusters():
    clusters = AnalyticsService.get_ml_clusters()
    return jsonify({'clusters': clusters})

@analytics_bp.route('/ml-predictions', methods=['GET'])
def get_predictions():
    predictions = AnalyticsService.get_ml_predictions()
    return jsonify(predictions)
